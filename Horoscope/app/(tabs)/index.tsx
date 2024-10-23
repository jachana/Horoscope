import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import { ZodiacImage } from '../../components/ZodiacImage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const getZodiacSign = (date: Date): string => {
  const month = date.getMonth() + 1; // JavaScript months are 0-11
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

export default function DailyHoroscopeScreen() {
  const [birthday, setBirthday] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const zodiacSign = getZodiacSign(birthday);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Horoscope</Text>
        <Text style={styles.subtitle}>Discover what the stars have in store for you today</Text>
      </View>

      <View style={styles.birthdayContainer}>
        <Text style={styles.birthdayLabel}>Select your birthday:</Text>
        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={birthday}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setShowPicker(false);
              }
              if (selectedDate) {
                setBirthday(selectedDate);
              }
            }}
          />
        )}
        {Platform.OS === 'android' && (
          <Text 
            style={[styles.birthdayLabel, { color: '#6B4DE6' }]}
            onPress={() => setShowPicker(true)}
          >
            {birthday.toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.readingContainer}>
        <Text style={styles.readingTitle}>Your Daily Reading</Text>
        <View style={styles.selectedSignHeader}>
          <ZodiacImage sign={zodiacSign} size={32} />
          <Text style={styles.selectedSignText}>{zodiacSign}</Text>
        </View>
        <Text style={styles.readingText}>
          Loading your personalized horoscope...
        </Text>
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
  birthdayContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  birthdayLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  readingContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  readingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  selectedSignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedSignText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  readingText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});
