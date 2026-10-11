import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import {
  ErrorCode,
  PurchasesError,
  type CustomerInfo,
  type Package,
} from "@revenuecat/purchases-js"

import { useAuth } from "../hooks/useAuth"
import { initializeRevenueCat, isRevenueCatConfigured } from "../services/revenuecat"

export type SubscriptionError = "config" | "load" | "purchase"

export type Tier = "free" | "pro" | "pro_plus"

const PRO_ENTITLEMENT = "pro"
const PRO_PLUS_ENTITLEMENT = "pro_plus"

function getTier(info: CustomerInfo | null): Tier {
  if (!info) return "free"

  if (PRO_PLUS_ENTITLEMENT in info.entitlements.active) return "pro_plus"

  if (PRO_ENTITLEMENT in info.entitlements.active) return "pro"

  return "free"
}

interface SubscriptionContextValue {
  tier: Tier
  hasPro: boolean
  hasProPlus: boolean
  loading: boolean
  purchasing: boolean
  error: SubscriptionError | null
  customerInfo: CustomerInfo | null
  packages: Package[]

  purchasePackage: (selectedPackage: Package) => Promise<boolean>
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<SubscriptionError | null>(null)

  const uid = user?.uid ?? null

  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    async function load() {
      setError(null)

      if (!uid) {
        setCustomerInfo(null)
        setLoading(false)

        return
      }

      const purchases = initializeRevenueCat(uid)

      if (!purchases) {
        setError(isRevenueCatConfigured() ? "load" : "config")
        setLoading(false)

        return
      }

      setLoading(true)

      try {
        const [info, offerings] = await Promise.all([
          purchases.getCustomerInfo(),
          purchases.getOfferings(),
        ])

        if (cancelled) return

        setCustomerInfo(info)
        setPackages(offerings.current?.availablePackages ?? [])
      } catch (err) {
        console.error("Failed to load subscription data:", err)

        if (!cancelled) setError("load")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [uid, authLoading])

  const purchasePackage = useCallback(
    async (selectedPackage: Package) => {
      if (!uid) return false

      const purchases = initializeRevenueCat(uid)

      if (!purchases) {
        setError("config")

        return false
      }

      try {
        setPurchasing(true)
        setError(null)

        const result = await purchases.purchase({
          rcPackage: selectedPackage,
          customerEmail: user?.email ?? undefined,
        })

        setCustomerInfo(result.customerInfo)

        return getTier(result.customerInfo) !== "free"
      } catch (err) {
        const cancelled =
          err instanceof PurchasesError && err.errorCode === ErrorCode.UserCancelledError

        if (!cancelled) {
          console.error("RevenueCat purchase failed:", err)
          setError("purchase")
        }

        return false
      } finally {
        setPurchasing(false)
      }
    },
    [uid, user],
  )

  const tier = getTier(customerInfo)
  const hasPro = tier !== "free"
  const hasProPlus = tier === "pro_plus"

  const value = useMemo(
    () => ({
      tier,
      hasPro,
      hasProPlus,
      loading: loading || authLoading,
      purchasing,
      error,
      customerInfo,
      packages,
      purchasePackage,
    }),
    [tier, hasPro, hasProPlus, loading, authLoading, purchasing, error, customerInfo, packages, purchasePackage],
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export { SubscriptionContext }
