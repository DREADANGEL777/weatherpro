import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

interface CheckoutBody {
  plan?: 'pro' | 'proPlus'
  userId?: string
  email?: string | null
}

const ACCESS_DURATION_MS = 30 * 24 * 60 * 60 * 1000

async function getCreemError(response: Response): Promise<string> {
  const text = await response.text()
  try {
    const body = JSON.parse(text) as {
      message?: string
      error?: string
      detail?: string
      trace_id?: string
    }
    const reason = body.message ?? body.error ?? body.detail ?? 'Unknown Creem error'
    return body.trace_id ? `${reason} (trace_id: ${body.trace_id})` : reason
  } catch {
    return text.slice(0, 240) || 'Unknown Creem error'
  }
}

function creemDevelopmentApi(): Plugin {
  return {
    name: 'creem-development-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')

      server.middlewares.use('/api/creem/checkout', async (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of request) chunks.push(Buffer.from(chunk))

        const sendJson = (body: unknown, status: number) => {
          response.statusCode = status
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(body))
        }

        let body: CheckoutBody
        try {
          body = JSON.parse(Buffer.concat(chunks).toString('utf8')) as CheckoutBody
        } catch {
          sendJson({ message: 'Invalid request body.' }, 400)
          return
        }

        const apiKey = env.CREEM_API_KEY
        const successUrl = env.CREEM_SUCCESS_URL
        const productId = body.plan === 'pro' ? env.CREEM_PRODUCT_PRO : env.CREEM_PRODUCT_PRO_PLUS

        if (!apiKey || !successUrl || !productId) {
          sendJson({ message: 'Creem server configuration is incomplete.' }, 500)
          return
        }
        if (!body.plan || !body.userId || !body.email) {
          sendJson({ message: 'plan, userId, and email are required.' }, 400)
          return
        }

        try {
          const apiBase = apiKey.startsWith('creem_test_')
            ? 'https://test-api.creem.io'
            : 'https://api.creem.io'
          const creemResponse = await fetch(`${apiBase}/v1/checkouts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
            body: JSON.stringify({
              product_id: productId,
              // Creem appends checkout_id and order_id to the success URL automatically.
              success_url: successUrl,
              customer: { email: body.email },
              metadata: { referenceId: body.userId, plan: body.plan },
            }),
          })
          const result = (await creemResponse.json()) as { checkout_url?: string; message?: string }
          if (!creemResponse.ok || !result.checkout_url) {
            sendJson({ message: result.message || 'Creem could not create the checkout.' }, 502)
            return
          }
          sendJson({ checkoutUrl: result.checkout_url }, 200)
        } catch (error) {
          console.error('Creem development checkout failed:', error)
          sendJson({ message: 'Could not connect to Creem.' }, 502)
        }
      })

      server.middlewares.use('/api/creem/status', async (request, response, next) => {
        if (request.method !== 'GET') {
          next()
          return
        }

        const query = new URL(request.url || '/', 'http://localhost').searchParams
        const checkoutId = query.get('checkout_id')
        const userId = query.get('user_id')
        const apiKey = env.CREEM_API_KEY

        const sendJson = (body: unknown, status: number) => {
          response.statusCode = status
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(body))
        }

        if (!apiKey || !checkoutId || !userId) {
          sendJson({ message: 'checkout_id and user_id are required.' }, 400)
          return
        }

        try {
          const apiBase = apiKey.startsWith('creem_test_')
            ? 'https://test-api.creem.io'
            : 'https://api.creem.io'
          const creemResponse = await fetch(
            `${apiBase}/v1/checkouts?checkout_id=${encodeURIComponent(checkoutId)}`,
            { headers: { 'x-api-key': apiKey } },
          )
          if (!creemResponse.ok) {
            const reason = await getCreemError(creemResponse)
            console.error('Creem checkout verification failed', {
              status: creemResponse.status,
              checkoutId,
              reason,
            })
            sendJson({
              message: `Creem checkout could not be verified (${creemResponse.status}): ${reason}`,
            }, 502)
            return
          }

          const checkout = await creemResponse.json() as {
            status?: string
            created_at?: string | number
            completed_at?: string | number
            paid_at?: string | number
            product?: string | { id?: string }
            metadata?: { referenceId?: string }
            order?: { status?: string; created_at?: string | number; paid_at?: string | number }
            subscription?: { status?: string; started_at?: string | number }
          }
          if (checkout.metadata?.referenceId !== userId) {
            sendJson({ message: 'This checkout does not belong to the signed-in user.' }, 403)
            return
          }

          const isPaid = checkout.status === 'completed' || checkout.order?.status === 'paid'
          const subscriptionStatus = checkout.subscription?.status
          const isActive = ['active', 'trialing', 'paid'].includes(subscriptionStatus || '')
          if (!isPaid || (checkout.subscription && !isActive)) {
            sendJson({ tier: 'free' }, 200)
            return
          }

          const paidAtValue = checkout.paid_at
            ?? checkout.completed_at
            ?? checkout.order?.paid_at
            ?? checkout.subscription?.started_at
            ?? checkout.order?.created_at
            ?? checkout.created_at
          const parsedPaidAt = paidAtValue === undefined
            ? Number.NaN
            : typeof paidAtValue === 'number' ? paidAtValue : Date.parse(paidAtValue)
          const paidAt = parsedPaidAt > 0 && parsedPaidAt < 1_000_000_000_000
            ? parsedPaidAt * 1000
            : parsedPaidAt
          if (!Number.isFinite(paidAt)) {
            sendJson({ tier: 'free' }, 200)
            return
          }
          const expiresAt = paidAt + ACCESS_DURATION_MS
          if (Date.now() >= expiresAt) {
            sendJson({ tier: 'free', expiresAt: new Date(expiresAt).toISOString() }, 200)
            return
          }

          const productId = typeof checkout.product === 'string' ? checkout.product : checkout.product?.id
          const tier = productId === env.CREEM_PRODUCT_PRO_PLUS ? 'pro_plus'
            : productId === env.CREEM_PRODUCT_PRO ? 'pro' : 'free'
          sendJson({ tier, expiresAt: new Date(expiresAt).toISOString() }, 200)
        } catch (error) {
          console.error('Creem development status check failed:', error)
          sendJson({ message: 'Could not connect to Creem.' }, 502)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), creemDevelopmentApi()],
})
