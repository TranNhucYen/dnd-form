import { SignJWT, jwtVerify } from 'jose'
import { AuthUser } from '@/features/auth/types/auth.type'

export type JwtPayload = AuthUser

// Hàm lấy key theo cơ chế lazy - chỉ chạy khi hàm sign/verify được gọi
function getEncodedKey(): Uint8Array {
  const secretKey = process.env.JWT_SECRET
  if (!secretKey) {
    throw new Error('JWT_SECRET không xác định')
  }
  return new TextEncoder().encode(secretKey)
}

export async function signJwtToken(payload: JwtPayload): Promise<string> {
  const encodedKey = getEncodedKey()

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const encodedKey = getEncodedKey()

    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}