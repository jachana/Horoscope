import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { PremiumFeature } from '../../components/PremiumFeature';
import { useProfile } from '../../contexts/ProfileContext';
import { generateWeeklyReading, generateMonthlyReading } from '../../services/horoscopeService';
import { HoroscopeReading } from '../../types/horoscope';

export default function ReadingsScreen() {
  const { profile } = useProfile();
  const [weeklyReading, setWeeklyReading] = useState<HoroscopeReading | null>(null);
  const [monthlyReading, setMonthlyReading] = useState<HoroscopeReading | null>(null);
  const [loading, setLoading] = useState<'weekly' | 'monthly' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWeeklyReading = async () => {
    setLoading('weekly');
    setError(null);
    try {
      const reading = await generateWeeklyReading(profile?.zodiacSign || 'Aries', profile);
      setWeeklyReading(reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate weekly reading');
    } finally {
      setLoading(null);
    }
  };

  const handleMonthlyReading = async () => {
    setLoading('monthly');
    setError(null);
    try {
      const reading = await generateMonthlyReading(profile?.zodiacSign || 'Aries', profile);
      setMonthlyReading(reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate monthly reading');
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Extended Readings</Text>
        <Text style={styles.subtitle}>Weekly and Monthly Astrological Insights</Text>
      </View>

      <View style={styles.content}>
        <PremiumFeature>
          <TouchableOpacity style={styles.readingCard} onPress={handleWeeklyReading} disabled={loading === 'weekly'}>
            <Text style={styles.cardTitle}>Weekly Reading</Text>
            <Text style={styles.cardDescription}>
              Get a detailed forecast for the upcoming week
            </Text>
            {loading === 'weekly' && <ActivityIndicator style={styles.loader} />}
          </TouchableOpacity>

          {weeklyReading && (
            <View style={styles.readingResult}>
              <Text style={styles.readingText}>{weeklyReading.reading}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.readingCard} onPress={handleMonthlyReading} disabled={loading === 'monthly'}>
            <Text style={styles.cardTitle}>Monthly Reading</Text>
            <Text style={styles.cardDescription}>
              Discover major astrological influences for the month ahead
            </Text>
            {loading === 'monthly' && <ActivityIndicator style={styles.loader} />}
          </TouchableOpacity>

          {monthlyReading && (
            <View style={styles.readingResult}>
              <Text style={styles.readingText}>{monthlyReading.reading}</Text>
            </View>
          )}
        </PremiumFeature>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About Extended Readings</Text>
          <Text style={styles.infoText}>
            Our extended readings use advanced astrological calculations and AI 
            to provide deeper insights into your future. Upgrade to premium to access 
            these detailed weekly and monthly forecasts.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#6B4DE6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    padding: 15,
  },
  readingCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
