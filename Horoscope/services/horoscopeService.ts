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

        const prompt = `Generate a detailed daily horoscope reading for ${sign} in JSON format with the following structure:
        {
            "reading": "Main horoscope reading (100-150 words about love, career, and personal growth)",
            "luckyNumbers": ["three numbers between 1-100"],
            "planetaryPositions": [
                {"planet": "name of planet", "position": "current astrological position"}
                // include at least 3 major planets
            ],
            "compatibleSigns": ["three most compatible zodiac signs for today"],
            "luckyColor": "color that brings luck today",
            "bestTimeForDecisions": "best time period for making important decisions today"
        }
        Make it sound professional and insightful.`;

        const payload = {
            model: 'mistralai/mistral-7b-instruct',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional astrologer who provides detailed daily horoscope readings. Always respond in valid JSON format.'
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
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
                validateStatus: (status) => status < 500
            }
        );

        if (response.status !== 200) {
            const errorData = response.data as unknown as OpenRouterError;
            throw new Error(errorData.error?.message || 'Failed to generate horoscope');
        }

        const content = response.data.choices[0]?.message.content.trim();

        if (!content) {
            throw new Error('No reading generated');
        }

        try {
            const parsedContent = JSON.parse(content);
            return {
                sign,
                reading: parsedContent.reading,
                date: new Date().toISOString().split('T')[0],
                luckyNumbers: parsedContent.luckyNumbers,
                planetaryPositions: parsedContent.planetaryPositions,
                compatibleSigns: parsedContent.compatibleSigns,
                luckyColor: parsedContent.luckyColor,
                bestTimeForDecisions: parsedContent.bestTimeForDecisions,
            };
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('Failed to parse horoscope data');
        }
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
