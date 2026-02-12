import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForToken,
  fetchUserInfo,
  createOrUpdateUser,
  setUserSession,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForToken(code);

    if (tokenResponse.code !== 0) {
      console.error('Token exchange returned error:', tokenResponse);
      throw new Error(`Token exchange failed: code=${tokenResponse.code}`);
    }

    const { accessToken, refreshToken, expiresIn } = tokenResponse.data;

    // Fetch user info
    const userInfo = await fetchUserInfo(accessToken);

    if (userInfo.code !== 0) {
      throw new Error('Failed to fetch user info');
    }

    const { userId, name, avatar } = userInfo.data;

    // Create or update user in database
    const user = await createOrUpdateUser(
      userId,
      accessToken,
      refreshToken,
      expiresIn,
      name,
      avatar
    );

    // Set session cookie
    await setUserSession(user.id);

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
