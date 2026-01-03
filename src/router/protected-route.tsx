import React from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("auth_token")

  if (!token) {
    return <Navigate to="/signin" replace />
  }

  // 已登录，渲染子路由
  return <>{children}</>
}
