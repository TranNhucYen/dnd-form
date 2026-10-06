export class AppError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details?: unknown

  constructor(
    message: string,
    code = 'INTERNAL_ERROR',
    status = 500,
    details?: unknown
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.status = status
    this.details = details
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
