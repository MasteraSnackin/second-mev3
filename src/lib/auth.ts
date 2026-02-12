import { prisma } from './prisma';
import { cookies } from 'next/headers';

export interface SecondMeTokenResponse {
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    scope?: string[];
  };
}

export interface SecondMeUserInfo {
  code: number;
  data: {
    userId: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    selfIntroduction: string;
    profileCompleteness: number;
    route: string;
  };
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<SecondMeTokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.SECONDME_CLIENT_ID!,
    client_secret: process.env.SECONDME_CLIENT_SECRET!,
    code,
    redirect_uri: process.env.SECONDME_REDIRECT_URI!,
  });

  console.log('Token exchange request:', {
    endpoint: process.env.SECONDME_TOKEN_ENDPOINT,
    params: params.toString().replace(process.env.SECONDME_CLIENT_SECRET!, '***'),
  });

  const response = await fetch(process.env.SECONDME_TOKEN_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const result = await response.json();
  console.log('Token exchange response:', { code: result.code, hasData: !!result.data });

  if (!response.ok) {
    throw new Error(`Failed to exchange code for token: ${JSON.stringify(result)}`);
  }

  return result;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<SecondMeTokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.SECONDME_CLIENT_ID!,
    client_secret: process.env.SECONDME_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });

  const response = await fetch(process.env.SECONDME_REFRESH_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

/**
 * Fetch user info from SecondMe API
 */
export async function fetchUserInfo(accessToken: string): Promise<SecondMeUserInfo> {
  const url = `${process.env.SECONDME_API_BASE_URL}/api/secondme/user/info`;

  console.log('Fetching user info:', { url, hasToken: !!accessToken });

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  console.log('User info response:', {
    status: response.status,
    ok: response.ok,
    code: result.code,
    hasData: !!result.data,
    dataFields: result.data ? Object.keys(result.data) : []
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status} - ${JSON.stringify(result)}`);
  }

  return result;
}

/**
 * Get current user session from cookies
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  // Check if token is expired
  if (user.tokenExpiresAt < new Date()) {
    try {
      // Refresh token
      const tokenResponse = await refreshAccessToken(user.refreshToken);

      if (tokenResponse.code === 0) {
        const expiresAt = new Date(Date.now() + tokenResponse.data.expiresIn * 1000);

        // Update user with new tokens
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            accessToken: tokenResponse.data.accessToken,
            refreshToken: tokenResponse.data.refreshToken,
            tokenExpiresAt: expiresAt,
          },
        });

        return updatedUser;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  return user;
}

/**
 * Create or update user session
 */
export async function createOrUpdateUser(
  secondmeUserId: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  nickname?: string,
  avatar?: string
) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  const user = await prisma.user.upsert({
    where: { secondmeUserId },
    update: {
      accessToken,
      refreshToken,
      tokenExpiresAt: expiresAt,
      nickname,
      avatar,
    },
    create: {
      secondmeUserId,
      accessToken,
      refreshToken,
      tokenExpiresAt: expiresAt,
      nickname,
      avatar,
    },
  });

  return user;
}

/**
 * Set user session cookie
 */
export async function setUserSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

/**
 * Clear user session
 */
export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete('user_id');
}
