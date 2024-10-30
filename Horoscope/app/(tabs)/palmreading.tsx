import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PremiumFeature } from '../../components/PremiumFeature';
import { getPalmReading, PalmReading } from '../../services/palmReadingService';

export default function PalmReadingScreen() {
  const [reading, setReading] = useState<PalmReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const loadPalmReading = async () => {
    try {
      setLoading(true);
      const newReading = await getPalmReading();
      setReading(newReading);
      setShowResults(true);
    } catch (error) {
      console.error('Error loading palm reading:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showResults) {
    return (
      <PremiumFeature>
        <ScrollView style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B4DE6" />
            </View>
          ) : reading ? (
            <View style={styles.readingContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowResults(false)}
              >
                <FontAwesome name="arrow-left" size={24} color="#6B4DE6" />
                <Text style={styles.backButtonText}>Back to Upload</Text>
              </TouchableOpacity>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Life Line</Text>
                <Text style={styles.sectionText}>{reading.lifeLine}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Heart Line</Text>
                <Text style={styles.sectionText}>{reading.heartLine}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Head Line</Text>
                <Text style={styles.sectionText}>{reading.headLine}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fate/Destiny Line</Text>
                <Text style={styles.sectionText}>{reading.fateDestinyLine}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>General Reading</Text>
                <Text style={styles.sectionText}>{reading.generalReading}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.errorText}>Failed to load palm reading</Text>
          )}
        </ScrollView>
      </PremiumFeature>
    );
  }

  return (
    <PremiumFeature>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Palm Reading</Text>
          <Text style={styles.subtitle}>Discover your life path through palmistry</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={loadPalmReading}
          >
            <FontAwesome name="camera" size={24} color="#6B4DE6" />
            <Text style={styles.uploadText}>Take a Photo of Your Palm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={loadPalmReading}
          >
            <FontAwesome name="image" size={24} color="#6B4DE6" />
            <Text style={styles.uploadText}>Upload Palm Photo</Text>
          </TouchableOpacity>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How to Take a Good Palm Photo</Text>
            <View style={styles.instruction}>
              <FontAwesome name="lightbulb-o" size={20} color="#6B4DE6" />
              <Text style={styles.instructionText}>
                Ensure good lighting conditions
              </Text>
            </View>
            <View style={styles.instruction}>
              <FontAwesome name="hand-paper-o" size={20} color="#6B4DE6" />
              <Text style={styles.instructionText}>
                Spread your fingers slightly apart
              </Text>
            </View>
            <View style={styles.instruction}>
              <FontAwesome name="camera" size={20} color="#6B4DE6" />
              <Text style={styles.instructionText}>
                Keep your palm flat and centered
              </Text>
            </View>
            <View style={styles.instruction}>
              <FontAwesome name="check-square-o" size={20} color="#6B4DE6" />
              <Text style={styles.instructionText}>
                Capture your dominant hand
              </Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What We Analyze</Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• Life Line Analysis</Text>
              <Text style={styles.featureItem}>• Heart Line Reading</Text>
              <Text style={styles.featureItem}>• Head Line Interpretation</Text>
              <Text style={styles.featureItem}>• Fate Line Insights</Text>
              <Text style={styles.featureItem}>• Mount Analysis</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </PremiumFeature>
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
  uploadButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#6B4DE6',
    marginLeft: 10,
    fontWeight: '500',
  },
  instructionsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  featuresContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  featuresList: {
    marginTop: 5,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  readingContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B4DE6',
    marginLeft: 10,
  },
});
