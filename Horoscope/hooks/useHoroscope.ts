import { useState, useCallback } from 'react';
import { generateHoroscopeReading } from '../services/horoscopeService';
import { HoroscopeReading, ZodiacSign } from '../types/horoscope';

export function useHoroscope() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reading, setReading] = useState<HoroscopeReading | null>(null);

    const getReading = useCallback(async (sign: ZodiacSign) => {
        try {
            setLoading(true);
            setError(null);
            const horoscopeReading = await generateHoroscopeReading(sign);
            setReading(horoscopeReading);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate horoscope reading');
            setReading(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearReading = useCallback(() => {
        setReading(null);
        setError(null);
    }, []);

    return {
        loading,
        error,
        reading,
        getReading,
        clearReading,
    };
}
