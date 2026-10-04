export type ActionSuccess<T = void> = [T] extends [void]
  ? {
      success: true
      data?: undefined
      error?: never
      code?: never
      details?: never
    }
  : {
      success: true
      data: T
      error?: never
      code?: never
      details?: never
    }

export type ActionFailure = {
  success: false
  error: string
  code?: string
  details?: unknown
  data?: never
}

export type ActionResponse<T = void> = ActionSuccess<T> | ActionFailure

