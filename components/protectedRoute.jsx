'use client'

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "../hooks/use-toast"
import { isTokenExpired } from "../helper/checkTokenExpiry"
import { useAuth } from "../lib/context/auth-context"

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { token, logout } = useAuth()
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  useEffect(() => {
    // Normalize pathname by removing trailing slash for comparison (handles trailingSlash config)
    const normalizedPath = pathname.replace(/\/$/, '') || '/';
    
    const publicRoutes = [
      "/", // Might be removed later
      "/about",
      "/contact",
      "/privacy-policy",
      "/register",
      "/login",
      "/shippingpolicy",
      "/termsandcondition",
      "/blogs",
      "/all-events",
      "/events",
      "/events/view-detail",
    ]

    const isPublic =
      publicRoutes.includes(normalizedPath) ||
      publicRoutes.some(route => normalizedPath.startsWith(route) && route !== "/") || 
      normalizedPath.startsWith("/admin/") ||
      normalizedPath.startsWith("/blogs/") ||
      normalizedPath.startsWith("/events/")

    if (isPublic) {
      setIsAuthChecked(true)
      return
    }

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      })
      router.replace("/login")
      return
    }

    if (isTokenExpired(token)) {
      logout()
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      })
      router.replace("/login")
      return
    }

    setIsAuthChecked(true)
  }, [pathname, router, toast, token, logout])

  if (!isAuthChecked) return null

  return <>{children}</>
}
