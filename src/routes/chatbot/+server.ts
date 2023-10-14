import { COHERE_KEY } from '$env/static/private'
import type { RequestHandler } from './$types'


// Build a prompt from the messages
function buildPrompt(messages: { content: string; role: 'system' | 'user' | 'assistant' }[]) {
  return (
    messages
      .map(({ content, role }) => {
        if (role === 'user') {
          return `Human: ${content}`;
        } else {
          return `Assistant: ${content}`;
        }
      })
      .join('\n\n') + 'Assistant:'
  );
}

export const POST = (async ({ request }) => {
  // Extract the `messages` from the body of the request
  const { messages } = await request.json();

  // Request the Cohere API for the response based on the prompt
  const response = await fetch('https://api.cohere.ai/generate', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${COHERE_KEY}`,
      'Cohere-Version': '2022-12-06',
    },
    body: JSON.stringify({
        model: 'command-nightly',
      prompt: buildPrompt(messages),
      return_likelihoods: "NONE",
      max_tokens: 200,
      temperature: 0.9,
      top_p: 1,
    }),
  })

  const result = await response.json()
  return new Response(result.generations[0].text.substring(0))
}) satisfies RequestHandler
