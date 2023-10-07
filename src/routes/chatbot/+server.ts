import type { RequestHandler } from './$types';
import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { experimental_buildLlama2Prompt } from "ai/prompts";
import { HUGGINGFACE_KEY } from "$env/static/private";

const hf = new HfInference( HUGGINGFACE_KEY)

export const GET: RequestHandler = async ({request}) => {
    
    const { messages } = await request.json()

    const response = await hf.textGenerationStream({
        model: 'meta-llama/Llama-2-70b-chat-hf',
        inputs: experimental_buildLlama2Prompt(messages),
    })

    const stream = HuggingFaceStream(response)
    return new StreamingTextResponse(stream)
};