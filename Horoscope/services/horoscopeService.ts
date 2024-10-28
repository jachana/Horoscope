import axios, { AxiosError } from 'axios';
import { ENV } from '../config/env';
import { HoroscopeReading, OpenRouterResponse, OpenRouterError, ZodiacSign } from '../types/horoscope';
import { UserProfile, checkSubscriptionAccess } from './profileService';

const headers = {
    'HTTP-Referer': 'https://github.com/juliomuhlbauer',
    'X-Title': 'Horoscope App',
    'Authorization': `Bearer ${ENV.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
};

class SubscriptionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SubscriptionError';
    }
}

export async function generateHoroscopeReading(sign: ZodiacSign, profile: UserProfile | null): Promise<HoroscopeReading> {
    try {
        if (!ENV.OPENROUTER_API_KEY) {
            throw new Error('OpenRouter API key is not configured');
        }

        const isPremium = checkSubscriptionAccess(profile);
        const prompt = `Generate a ${isPremium ? 'detailed premium' : 'basic'} daily horoscope reading for ${sign} in JSON format with the following structure:
        {
            "reading": "${isPremium ? 'Detailed 150-200 word' : 'Brief 50-word'} horoscope reading about ${isPremium ? 'love, career, personal growth, and spiritual guidance' : 'general daily outlook'
            }",
            ${isPremium ? `
            "luckyNumbers": ["three numbers between 1-100"],
            "planetaryPositions": [
                {"planet": "name of planet", "position": "current astrological position"}
                // include at least 3 major planets
            ],
            "compatibleSigns": ["three most compatible zodiac signs for today"],
            "luckyColor": "color that brings luck today",
            "bestTimeForDecisions": "best time period for making important decisions today"
            ` : `
            "luckyNumbers": ["one number between 1-100"]
            `}
        }
        Make it sound ${isPremium ? 'professional, detailed, and insightful' : 'concise and general'}.`;

        const payload = {
            model: 'mistralai/mistral-7b-instruct',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional astrologer who provides daily horoscope readings. Always respond in valid JSON format.'
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: isPremium ? 500 : 200,
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
            const reading: HoroscopeReading = {
                sign,
                reading: parsedContent.reading,
                date: new Date().toISOString().split('T')[0],
                luckyNumbers: parsedContent.luckyNumbers || [],
                planetaryPositions: isPremium ? parsedContent.planetaryPositions : [],
                compatibleSigns: isPremium ? parsedContent.compatibleSigns : [],
                luckyColor: isPremium ? parsedContent.luckyColor : '',
                bestTimeForDecisions: isPremium ? parsedContent.bestTimeForDecisions : '',
            };

            // Add premium feature notice for free users
            if (!isPremium) {
                reading.reading += '\n\n⭐ Upgrade to Premium for detailed readings including planetary positions, compatible signs, and more!';
            }

            return reading;
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

export async function generateDreamReading(description: string, profile: UserProfile | null): Promise<string> {
    if (!checkSubscriptionAccess(profile)) {
        throw new SubscriptionError('Dream readings are a premium feature. Start your 1-week free trial or upgrade to access detailed dream interpretations!');
    }

    // Implementation for premium dream reading
    // TODO: Implement dream reading logic
    return "Premium dream reading feature coming soon!";
}

export async function generatePalmReading(profile: UserProfile | null): Promise<string> {
    if (!checkSubscriptionAccess(profile)) {
        throw new SubscriptionError('Palm readings are a premium feature. Start your 1-week free trial or upgrade to access personalized palm interpretations!');
    }

    // Implementation for premium palm reading
    // TODO: Implement palm reading logic
    return "Premium palm reading feature coming soon!";
}

export async function generateWeeklyReading(sign: ZodiacSign, profile: UserProfile | null): Promise<HoroscopeReading> {
    if (!checkSubscriptionAccess(profile)) {
        throw new SubscriptionError('Weekly readings are a premium feature. Start your 1-week free trial or upgrade to access detailed weekly forecasts!');
    }

    // Implementation for weekly reading
    // TODO: Implement weekly reading logic similar to daily reading
    return {
        sign,
        reading: "Weekly reading coming soon!",
        date: new Date().toISOString().split('T')[0],
        luckyNumbers: [],
        planetaryPositions: [],
        compatibleSigns: [],
        luckyColor: '',
        bestTimeForDecisions: '',
    };
}

export async function generateMonthlyReading(sign: ZodiacSign, profile: UserProfile | null): Promise<HoroscopeReading> {
    if (!checkSubscriptionAccess(profile)) {
        throw new SubscriptionError('Monthly readings are a premium feature. Start your 1-week free trial or upgrade to access detailed monthly forecasts!');
    }

    // Implementation for monthly reading
    // TODO: Implement monthly reading logic similar to daily reading
    return {
        sign,
        reading: "Monthly reading coming soon!",
        date: new Date().toISOString().split('T')[0],
        luckyNumbers: [],
        planetaryPositions: [],
        compatibleSigns: [],
        luckyColor: '',
        bestTimeForDecisions: '',
    };
}
