import axios, { AxiosError } from 'axios';
import { ENV } from '../config/env';
import { HoroscopeReading, OpenRouterResponse, OpenRouterError, ZodiacSign } from '../types/horoscope';

const headers = {
    'HTTP-Referer': 'https://github.com/juliomuhlbauer',
    'X-Title': 'Horoscope App',
    'Authorization': `Bearer ${ENV.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
};

export async function generateHoroscopeReading(sign: ZodiacSign): Promise<HoroscopeReading> {
    try {
        if (!ENV.OPENROUTER_API_KEY) {
            throw new Error('OpenRouter API key is not configured');
        }

        const prompt = `Generate a daily horoscope reading for ${sign}. The reading should be personal, 
    insightful, and include aspects about love, career, and personal growth. Make it sound like a 
    professional astrologer wrote it. Keep it between 100-150 words.`;

        const payload = {
            model: 'mistralai/mistral-7b-instruct',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional astrologer who writes daily horoscope readings.'
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 200,
        };

        console.log('Making API request with headers:', {
            ...headers,
            'Authorization': 'Bearer [REDACTED]'
        });

        const response = await axios.post<OpenRouterResponse>(
            ENV.OPENROUTER_API_URL,
            payload,
            {
                headers,
                validateStatus: (status) => status < 500 // Allow 400 responses to be handled in the try block
            }
        );

        if (response.status !== 200) {
            const errorData = response.data as unknown as OpenRouterError;
            throw new Error(errorData.error?.message || 'Failed to generate horoscope');
        }

        const reading = response.data.choices[0]?.message.content.trim();

        if (!reading) {
            throw new Error('No reading generated');
        }

        return {
            sign,
            reading,
            date: new Date().toISOString().split('T')[0],
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<OpenRouterError>;
            console.error('API Error:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                headers: axiosError.response?.headers,
            });

            if (axiosError.response?.status === 401) {
                throw new Error('Invalid API key. Please check your OpenRouter API key.');
            }

            if (axiosError.response?.status === 400) {
                const errorMessage = (axiosError.response.data as OpenRouterError)?.error?.message;
                throw new Error(`Invalid request: ${errorMessage || 'Please check your request format'}`);
            }

            throw new Error(
                (axiosError.response?.data as OpenRouterError)?.error?.message ||
                'Failed to connect to OpenRouter API'
            );
        }

        throw error;
    }
}
