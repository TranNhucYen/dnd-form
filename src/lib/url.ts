/**
 * Utility functions for URL generation and management
 */

/**
 * Lấy URL gốc (Base URL) của ứng dụng một cách linh hoạt theo môi trường (Client/Server/Vercel/Production)
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

/**
 * Tạo đường dẫn chia sẻ biểu mẫu công khai
 * @param formId ID của biểu mẫu
 */
export function getFormShareUrl(formId: number | string): string {
  return `${getBaseUrl()}/forms/${formId}`
}
