import { SignJWT, jwtVerify } from 'jose'
import { AuthUser } from '@/features/auth/types/auth.type'

const secretKey = process.env.JWT_SECRET

if (!secretKey) {
  throw new Error('JWT_SECRET không các định')
}
const encodedKey = new TextEncoder().encode(secretKey)

export type JwtPayload = AuthUser

export async function signJwtToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}
