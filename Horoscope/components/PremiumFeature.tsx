import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../contexts/ProfileContext';

interface PremiumFeatureProps {
  children: React.ReactNode;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({ children }) => {
  const navigation = useNavigation<any>();  // Using any temporarily for navigation
  const { profile } = useProfile();
  const [debugPremium, setDebugPremium] = useState(false);

  // Check if user is premium either through profile or debug mode
  const isPremium = profile?.subscription?.tier === 'premium' || debugPremium;

  if (isPremium) {
    return (
      <TouchableOpacity
        onLongPress={() => setDebugPremium(false)}
        delayLongPress={1000}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onLongPress={() => setDebugPremium(true)}
      delayLongPress={1000}
      style={styles.container}
    >
      <Text style={styles.text}>This feature is only available for premium users.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>Upgrade to Premium</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
