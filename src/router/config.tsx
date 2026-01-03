import { lazy } from "react"
import { Navigate } from "react-router-dom"

// 懒加载组件
const HomePage = lazy(() => import("@/pages/HomePage"))
const LoginPage = lazy(() => import("@/app/login/page"))

export interface RouteConfig {
  path: string
  element: React.ReactNode
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  // 默认重定向
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]