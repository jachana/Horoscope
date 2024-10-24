import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ZodiacImage } from '../../components/ZodiacImage';
import { ZodiacSign } from '../../types/horoscope';
import { useProfile } from '../../contexts/ProfileContext';

const zodiacColors: Record<ZodiacSign, string> = {
  Aries: '#FF4136',
  Taurus: '#2ECC40',
  Gemini: '#FFDC00',
  Cancer: '#B10DC9',
  Leo: '#FF851B',
  Virgo: '#7FDBFF',
  Libra: '#F012BE',
  Scorpio: '#85144b',
  Sagittarius: '#39CCCC',
  Capricorn: '#01FF70',
  Aquarius: '#0074D9',
  Pisces: '#3D9970'
};

const getZodiacSign = (date: Date): ZodiacSign => {
  const month = date.getMonth() + 1;
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

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
}

const InputField = ({ label, value, onChangeText, placeholder, multiline = false }: InputFieldProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      multiline={multiline}
    />
  </View>
);

const WebDatePicker = ({ value, onChange }: { value: Date; onChange: (date: Date) => void }) => {
  return (
    <input
      type="date"
      value={value.toISOString().split('T')[0]}
      onChange={(e) => {
        const date = new Date(e.target.value);
        onChange(date);
      }}
      style={{
        fontSize: '16px',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: '#f8f8f8',
        color: '#333',
        width: '100%',
      }}
    />
  );
};

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const [birthday, setBirthday] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [lifeGoals, setLifeGoals] = useState('');
  const [heritage, setHeritage] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

  // Load saved profile data
  useEffect(() => {
    if (profile) {
      if (profile.birthDate) {
        setBirthday(new Date(profile.birthDate));
      }
      if (profile.birthTime) {
        setBirthTime(profile.birthTime);
      }
      if (profile.placeOfBirth) {
        setBirthPlace(profile.placeOfBirth);
      }
      if (profile.lifeGoals) {
        setLifeGoals(profile.lifeGoals);
      }
      if (profile.heritage) {
        setHeritage(profile.heritage);
      }
      if (profile.relationshipStatus) {
        setRelationshipStatus(profile.relationshipStatus);
      }
    }
  }, [profile]);

  // Update profile when any field changes
  const handleFieldUpdate = async (field: string, value: string) => {
    try {
      await updateProfile({
        [field]: value
      });
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  // Update profile when birthday changes
  const handleBirthdayChange = async (date: Date) => {
    setBirthday(date);
    try {
      await updateProfile({
        birthDate: date.toISOString(),
        zodiacSign: getZodiacSign(date)
      });
    } catch (error) {
      console.error('Failed to update birth date:', error);
    }
  };

  const zodiacSign = getZodiacSign(birthday);
  const backgroundImage = require('../../assets/images/Backgrounds/Aries.jpg');

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return <WebDatePicker value={birthday} onChange={handleBirthdayChange} />;
    }

    return (
      <>
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
                handleBirthdayChange(selectedDate);
              }
            }}
          />
        )}
        {Platform.OS === 'android' && !showPicker && (
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.dateText}>{birthday.toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <View style={[styles.header]}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your Personal Information</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.zodiacContainer}>
            <View style={styles.zodiacContent}>
              <ZodiacImage sign={zodiacSign} size={120} />
            </View>
            <Text style={styles.zodiacText}>{zodiacSign}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Birth Information</Text>
            <View style={styles.birthdayContainer}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              {renderDatePicker()}
            </View>
            <InputField
              label="Time of Birth"
              value={birthTime}
              onChangeText={(text) => {
                setBirthTime(text);
                handleFieldUpdate('birthTime', text);
              }}
              placeholder="e.g., 14:30"
            />
            <InputField
              label="Place of Birth"
              value={birthPlace}
              onChangeText={(text) => {
                setBirthPlace(text);
                handleFieldUpdate('placeOfBirth', text);
              }}
              placeholder="City, Country"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <InputField
              label="Heritage"
              value={heritage}
              onChangeText={(text) => {
                setHeritage(text);
                handleFieldUpdate('heritage', text);
              }}
              placeholder="Cultural background"
            />
            <InputField
              label="Relationship Status"
              value={relationshipStatus}
              onChangeText={(text) => {
                setRelationshipStatus(text);
                handleFieldUpdate('relationshipStatus', text);
              }}
              placeholder="Single, Married, etc."
            />
            <InputField
              label="Life Goals"
              value={lifeGoals}
              onChangeText={(text) => {
                setLifeGoals(text);
                handleFieldUpdate('lifeGoals', text);
              }}
              placeholder="Share your aspirations..."
              multiline={true}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // More opaque white
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  birthdayContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#6B4DE6',
    paddingVertical: 8,
  },
  zodiacContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  zodiacContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  zodiacText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f8f8',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});
