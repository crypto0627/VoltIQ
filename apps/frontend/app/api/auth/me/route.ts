import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
// import { cookies } from 'next/headers' // Remove this import if not used elsewhere in this file
import { prisma } from '@/lib/prisma'

// export const dynamic = 'force-dynamic' // You might not need this now if you're not reading cookies directly here

export async function GET(req: Request) { // Accept request object
  try {
    // Read token from Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1]; // Extract token after "Bearer "

    console.log('[/api/auth/me] Received token:', token ? 'Exists' : 'None', 'from Authorization header');

    if (!token) {
      console.log('[/api/auth/me] No token provided in Authorization header, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('[/api/auth/me] JWT_SECRET not set');
      throw new Error('JWT_SECRET environment variable not set')
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, jwtSecret) as { userId: string };
      console.log('[/api/auth/me] Token decoded:', decoded.userId);
    } catch (jwtError: any) {
      console.error('[/api/auth/me] JWT verification failed:', jwtError.message);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      console.log('[/api/auth/me] User not found for id:', decoded.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('[/api/auth/me] User found, returning 200');
    return NextResponse.json(user)
  } catch (err: any) {
    console.error('GET /api/auth/me error:', err)
    return NextResponse.json({ error: 'Internal server error during auth check' }, { status: 500 }) // Changed to 500 for internal error
  }
}
