import type { ApiResponse, ApiError } from './types'

// API 基础配置
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// API 错误处理
export class ApiErrorHandler extends Error {
  code: number
  details?: Record<string, unknown>

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiError'
    this.code = error.code
    this.details = error.details
  }
}

// HTTP 请求方法
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: Record<string, unknown> | string | FormData
  params?: Record<string, string>
}

// API 客户端类
class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.defaultHeaders = API_CONFIG.headers
  }

  // 设置认证令牌
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  // 移除认证令牌
  removeAuthToken() {
    delete this.defaultHeaders['Authorization']
  }

  // 构建完整URL
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return url.toString()
  }

  // 通用请求方法
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, params } = options

    const url = this.buildUrl(endpoint, params)
    const requestHeaders = { ...this.defaultHeaders, ...headers }

    try {
      const requestBody = body ?
        (body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body))
        : undefined

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
      })

      const data = await response.json() as Record<string, unknown>

      if (!response.ok) {
        throw new ApiErrorHandler({
          message: (data.message as string) || `HTTP ${response.status}: ${response.statusText}`,
          code: response.status,
          details: data,
        })
      }

      return data as unknown as ApiResponse<T>
    } catch (error) {
      if (error instanceof ApiErrorHandler) {
        throw error
      }

      // 网络错误或其他错误
      throw new ApiErrorHandler({
        message: error instanceof Error ? error.message : '网络请求失败',
        code: 0,
        details: error as Record<string, unknown>,
      })
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  // POST 请求
  async post<T>(endpoint: string, body?: Record<string, unknown> | string | FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  // PUT 请求
  async put<T>(endpoint: string, body?: Record<string, unknown> | string | FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // PATCH 请求
  async patch<T>(endpoint: string, body?: Record<string, unknown> | string | FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }
}

// 导出API客户端实例
export const apiClient = new ApiClient()
export default apiClient