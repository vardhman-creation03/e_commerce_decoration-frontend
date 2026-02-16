'use client'

// ==========================================
// PROTECTED ROUTE - Simplified (All Public)
// ==========================================
// All authentication removed - everything is public
// This component now just renders children without any auth checks

export default function ProtectedRoute({ children }) {
  // All routes are public - no authentication required
  return <>{children}</>
}
