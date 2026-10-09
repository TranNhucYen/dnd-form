import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { HomeView } from '@/features/home/components/HomeView'

export const metadata: Metadata = {
  title: 'Trang chủ',
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const user = token ? await verifyJwtToken(token) : null

  return <HomeView user={user} />
}