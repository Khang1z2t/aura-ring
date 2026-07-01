import { buildChatReply } from '@/lib/chat/reply'
import { buildUnavailableResponse } from '@/lib/chat/guards'
import { chatRequestSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const json = await request.json().catch(() => null)
  const parsed = chatRequestSchema.safeParse(json)

  if (!parsed.success) {
    return Response.json(
      { message: 'Invalid chat request.', suggestions: [], links: [] },
      { status: 400 }
    )
  }

  const messages = parsed.data.messages
  const latestMessage = messages.at(-1)?.content ?? ''

  try {
    const { response, source, status } = await buildChatReply({
      message: latestMessage,
      history: messages,
    })

    console.info('[chat]', {
      source,
      status,
      message: latestMessage.slice(0, 80),
    })

    return Response.json(response, { status })
  } catch (error) {
    console.error('[chat]', {
      source: 'route-error',
      message: latestMessage.slice(0, 80),
      error: error instanceof Error ? error.message : 'unknown error',
    })

    return Response.json(buildUnavailableResponse(latestMessage), { status: 502 })
  }
}
