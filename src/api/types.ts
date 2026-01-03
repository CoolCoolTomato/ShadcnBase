// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

// 用户信息类型
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

// 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

// 刷新令牌请求参数
export interface RefreshTokenRequest {
  refreshToken: string
}

// API 错误类型
export interface ApiError {
  message: string
  code: number
  details?: any
}