import OpenAI from 'openai';
import {
  compareInstructions,
  getComparePrompt,
  getPrompt,
  openAICompareFormat,
  openAITranslationFormat,
  translationInstructions,
} from '../utils';
import { OpenAIService } from './openai.service';

const mockParse = jest.fn();

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    responses: {
      parse: mockParse,
    },
  })),
}));

describe('OpenAIService', () => {
  let service: OpenAIService;
  const openAIMock = OpenAI as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    service = new OpenAIService();
  });

  it('creates the OpenAI client with the configured API key', () => {
    expect(openAIMock).toHaveBeenCalledWith({
      apiKey: 'test-openai-key',
    });
  });

  it('parses text enhancement responses with the translation schema', async () => {
    const parsed = {
      grammarFix: 'I need more practice.',
      informalB2: 'I need more practice.',
      informalC1: 'I could use more practice.',
      formalB2: 'I need more practice.',
      formalC1: 'I require additional practice.',
    };

    mockParse.mockResolvedValue({
      output_parsed: parsed,
    });

    await expect(
      service.enhanceText('Necesito mas practica', 'Writing exercise'),
    ).resolves.toEqual(parsed);
    expect(mockParse).toHaveBeenCalledWith({
      input: getPrompt('Necesito mas practica', 'Writing exercise'),
      instructions: translationInstructions,
      model: 'gpt-4o-mini',
      text: {
        format: openAITranslationFormat,
      },
    });
  });

  it('parses phrase comparison responses with the comparison schema', async () => {
    const parsed = {
      inputs: [
        {
          explanation: 'This is less natural.',
          input: 'I did not went',
        },
        {
          explanation: 'This is grammatically correct.',
          input: 'I did not go',
        },
      ],
      summary: 'Use the base verb after did.',
    };

    mockParse.mockResolvedValue({
      output_parsed: parsed,
    });

    await expect(
      service.compare(['I did not went', 'I did not go'], 'Grammar lesson'),
    ).resolves.toEqual(parsed);
    expect(mockParse).toHaveBeenCalledWith({
      input: getComparePrompt(
        ['I did not went', 'I did not go'],
        'Grammar lesson',
      ),
      instructions: compareInstructions,
      model: 'gpt-4o-mini',
      text: {
        format: openAICompareFormat,
      },
    });
  });
});