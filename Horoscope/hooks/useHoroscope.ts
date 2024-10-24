import { useState, useCallback } from 'react';
import { generateHoroscopeReading, generateDreamReading, generatePalmReading } from '../services/horoscopeService';
import { HoroscopeReading, ZodiacSign } from '../types/horoscope';
import { useProfile } from '../contexts/ProfileContext';

export function useHoroscope() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reading, setReading] = useState<HoroscopeReading | null>(null);
    const { profile } = useProfile();

    const getReading = useCallback(async (sign: ZodiacSign) => {
        try {
            setLoading(true);
            setError(null);
            const horoscopeReading = await generateHoroscopeReading(sign, profile);
            setReading(horoscopeReading);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate horoscope reading');
            setReading(null);
        } finally {
            setLoading(false);
        }
    }, [profile]);

    const getDreamReading = useCallback(async (description: string) => {
        try {
            setLoading(true);
            setError(null);
            const dreamInterpretation = await generateDreamReading(description, profile);
            return dreamInterpretation;
        } catch (err) {
            if (err instanceof Error && err.name === 'SubscriptionError') {
                setError(err.message);
                return null;
            }
            setError(err instanceof Error ? err.message : 'Failed to generate dream reading');
            return null;
        } finally {
            setLoading(false);
        }
    }, [profile]);

    const getPalmReading = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const palmInterpretation = await generatePalmReading(profile);
            return palmInterpretation;
        } catch (err) {
            if (err instanceof Error && err.name === 'SubscriptionError') {
                setError(err.message);
                return null;
            }
            setError(err instanceof Error ? err.message : 'Failed to generate palm reading');
            return null;
        } finally {
            setLoading(false);
        }
    }, [profile]);

    const clearReading = useCallback(() => {
        setReading(null);
        setError(null);
    }, []);

    return {
        loading,
        error,
        reading,
        getReading,
        getDreamReading,
        getPalmReading,
        clearReading,
    };
}
