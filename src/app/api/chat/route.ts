import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { message, sessionId } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create or get session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: user.id,
          sessionName: `对话 ${new Date().toLocaleString('zh-CN')}`,
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        userId: user.id,
        role: 'user',
        content: message,
      },
    });

    // Call SecondMe Chat API with streaming
    const response = await fetch(`${process.env.SECONDME_API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Chat API request failed');
    }

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let assistantMessage = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            assistantMessage += chunk;

            // Send chunk to client
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          }

          // Save assistant message
          await prisma.message.create({
            data: {
              sessionId: session.id,
              userId: user.id,
              role: 'assistant',
              content: assistantMessage,
            },
          });

          // Send completion signal with session ID
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, sessionId: session.id })}\n\n`)
          );
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'Chat request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
