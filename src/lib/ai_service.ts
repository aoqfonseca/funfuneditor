import { processTextWithAi } from './commands';

export async function applyAiTransform(text: string, prompt: string): Promise<string> {
  return await processTextWithAi(text, prompt);
}
