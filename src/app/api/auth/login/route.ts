import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SECONDME_CLIENT_ID?.trim();
  const redirectUri = process.env.SECONDME_REDIRECT_URI?.trim();
  const oauthUrl = process.env.SECONDME_OAUTH_URL?.trim();

  const authUrl = `${oauthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri!
  )}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
