import type { RequestHandler } from './$types';
import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";
import { HUGGINGFACE_KEY } from "$env/static/private";


const hf = new HfInference( HUGGINGFACE_KEY)

export const POST: RequestHandler = async ({request}) => {
    
    const { messages } = await request.json()

    const response = await hf.textGenerationStream({
        model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        inputs: experimental_buildOpenAssistantPrompt(messages),
        parameters: {
        max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
    },})

    const stream = HuggingFaceStream(response)
    return new StreamingTextResponse(stream)
};