import { AppError } from './app-error'

export class ValidationError extends AppError {
  constructor(message = 'Dữ liệu không hợp lệ', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Bạn cần đăng nhập để thực hiện thao tác này') {
    super(message, 'UNAUTHORIZED', 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Bạn không có quyền thực hiện thao tác này', code = 'FORBIDDEN') {
    super(message, code, 403)
  }
}

export class AccountBlockedError extends ForbiddenError {
  constructor(message = 'Tài khoản của bạn đã bị khóa') {
    super(message, 'ACCOUNT_BLOCKED')
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Không tìm thấy dữ liệu yêu cầu') {
    super(message, 'NOT_FOUND', 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Dữ liệu đã tồn tại hoặc xảy ra xung đột') {
    super(message, 'CONFLICT', 409)
  }
}

export class InternalError extends AppError {
  constructor(message = 'Đã có lỗi xảy ra trên hệ thống. Vui lòng thử lại sau.') {
    super(message, 'INTERNAL_ERROR', 500)
  }
}
