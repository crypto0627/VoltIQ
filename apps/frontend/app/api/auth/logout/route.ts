import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear the auth_token cookie
    cookieStore.delete('auth_token')

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error('POST /api/auth/logout error:', err)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
