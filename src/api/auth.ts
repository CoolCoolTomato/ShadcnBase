import apiClient from './client'
import type { LoginRequest, LoginResponse, RefreshTokenRequest, ApiResponse, User } from './types'

// 认证相关 API
export const authApi = {
  // 登录
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)

    // 登录成功后设置令牌
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token)
      // 保存到本地存储
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response
  },

  // 注销
  async logout(): Promise<ApiResponse<void>> {
    try {
      // 调用服务器注销接口
      await apiClient.post('/auth/logout')
    } catch (error) {
      // 即使服务器返回错误，也要清理本地状态
      console.warn('Server logout failed:', error)
    } finally {
      // 清理本地状态
      apiClient.removeAuthToken()
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }

    return { success: true, message: '注销成功' }
  },

  // 刷新令牌
  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', request)

    // 更新令牌
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }

    return response
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me')
  },

  // 检查认证状态
  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.getCurrentUser()
      return response.success
    } catch {
      return false
    }
  },

  // 从本地存储恢复认证状态
  restoreAuthState(): { token: string; user: User } | null {
    try {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      if (token && userStr) {
        const user = JSON.parse(userStr)
        apiClient.setAuthToken(token)
        return { token, user }
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      // 清理无效的本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }

    return null
  },
}

export default authApi