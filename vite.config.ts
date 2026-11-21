import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

interface CheckoutBody {
  plan?: 'pro' | 'proPlus'
  userId?: string
  email?: string | null
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
              success_url: successUrl.includes('checkout_id=')
                ? successUrl
                : `${successUrl}${successUrl.includes('?') ? '&' : '?'}checkout_id={checkout_id}`,
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
            sendJson({ message: 'Creem checkout could not be verified.' }, 502)
            return
          }

          const checkout = await creemResponse.json() as {
            status?: string
            product?: string | { id?: string }
            metadata?: { referenceId?: string }
            order?: { status?: string }
            subscription?: { status?: string }
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

          const productId = typeof checkout.product === 'string' ? checkout.product : checkout.product?.id
          const tier = productId === env.CREEM_PRODUCT_PRO_PLUS ? 'pro_plus'
            : productId === env.CREEM_PRODUCT_PRO ? 'pro' : 'free'
          sendJson({ tier }, 200)
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
