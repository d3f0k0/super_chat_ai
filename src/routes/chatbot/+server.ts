// src/routes/api/chat/+server.ts
import type { RequestHandler } from './$types'
import { OpenAI } from 'openai'
import { OPENAI_KEY } from '$env/static/private'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const fireworks = new OpenAI({baseURL: 'https://api.fireworks.ai/inference/v1', apiKey: OPENAI_KEY!})

export const POST = (async ({ request }) => {
  // Extract the `messages` from the body of the request
  const { messages } = await request.json();

  // Request the Fireworks API for the response based on the prompt
  const response = await fireworks.chat.completions.create({
  model: 'accounts/fireworks/models/llama-v2-70b-chat',
  stream: true,
  messages: messages,
    max_tokens: 1000,
    temperature: 0.75,
    top_p: 1,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}) satisfies RequestHandler
