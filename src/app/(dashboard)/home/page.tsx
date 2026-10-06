import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/jwt'
import { HomeView } from '@/features/home/components/HomeView'

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const user = token ? await verifyJwtToken(token) : null

  return <HomeView user={user} />
}