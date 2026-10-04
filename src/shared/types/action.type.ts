export type ActionSuccess<T = void> = [T] extends [void]
  ? {
      success: true
      data?: undefined
      error?: never
    }
  : {
      success: true
      data: T
      error?: never
    }

export type ActionFailure = {
  success: false
  error: string
  data?: never
}

export type ActionResponse<T = void> = ActionSuccess<T> | ActionFailure
