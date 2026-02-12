import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${process.env.SECONDME_API_BASE_URL}/api/user/shades`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user shades');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User shades error:', error);
    return NextResponse.json({ error: 'Failed to fetch user shades' }, { status: 500 });
  }
}
