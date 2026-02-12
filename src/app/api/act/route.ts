import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { classifyIntent } from '@/lib/act';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const result = await classifyIntent(text, user.accessToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Intent classification error:', error);
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 });
  }
}
