export type ZodiacSign =
    | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
    | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
    | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface HoroscopeReading {
    sign: ZodiacSign;
    reading: string;
    date: string;
}

export interface OpenRouterResponse {
    id: string;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface OpenRouterError {
    error: {
        message: string;
        type: string;
        param?: string;
        code?: string;
    };
}
