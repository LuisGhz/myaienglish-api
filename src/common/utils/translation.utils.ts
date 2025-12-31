import { zodTextFormat } from 'openai/helpers/zod';
import z from 'zod';

export const translationInstructions = `
  You are an expert English teacher and your sole responsibility is to provide improved English variations of the given text.
  * Only generate English variations as requested (grammar fix, informal, semi-formal, formal, polite).
  * Do not answer or perform any other tasks outside of providing these English variations.
  * Respond strictly in the specified formats, without any extra commentary, explanations, or unrelated content.
  * If the request is not related to improving English variations, politely refuse to answer.
  * Sometimes the provided text may be in another language (e.g., Spanish); in such cases, translate it to English first before providing the variations.
  * English should sound natural and fluent, as if written by a native speaker.
`;

export const getPrompt = (text: string, context?: string) => {
  return `
    Text: ""${text}"".
    ${context ? `Also consider the following context which can help you to give result, consider this context can be in another language such as spanish: ""${context}""` : ''}
  `;
};

export const translationObject = z.object({
  grammarFix: z.string().describe('The translated text.'),
  informalWay: z.string().describe('The translated text in an informal way.'),
  semiFormalWay: z
    .string()
    .describe('The translated text in a semi formal way.'),
  formalWay: z.string().describe('The translated text in a formal way.'),
  politeWay: z.string().describe('The translated text in a polite way.'),
});

export type TranslationSchema = z.infer<typeof translationObject>;

export const openAITranslationFormat = zodTextFormat(
  translationObject,
  'translation',
);
