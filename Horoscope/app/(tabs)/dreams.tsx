import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { PremiumFeature } from '../../components/PremiumFeature';
import { useProfile } from '../../contexts/ProfileContext';
import { generateDreamReading } from '../../services/horoscopeService';

export default function DreamAnalysisScreen() {
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamAnalysis, setDreamAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfile();

  const handleDreamAnalysis = async () => {
    if (dreamDescription.trim().length === 0) {
      setError('Please enter a dream description');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const analysis = await generateDreamReading(dreamDescription, profile);
      setDreamAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate dream analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dream Analysis</Text>
        <Text style={styles.subtitle}>Unlock the meaning behind your dreams</Text>
      </View>

      <View style={styles.content}>
        <PremiumFeature>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Describe your dream</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={6}
              placeholder="Write about your dream in detail..."
              value={dreamDescription}
              onChangeText={setDreamDescription}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleDreamAnalysis}
            disabled={loading}
          >
            <Text style={styles.analyzeButtonText}>Analyze Dream</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator style={styles.loader} />}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {dreamAnalysis && (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisTitle}>Dream Analysis</Text>
              <Text style={styles.analysisText}>{dreamAnalysis}</Text>
            </View>
          )}
        </PremiumFeature>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips for Dream Journaling</Text>
          <Text style={styles.tipText}>• Write your dream immediately after waking</Text>
          <Text style={styles.tipText}>• Include as many details as possible</Text>
          <Text style={styles.tipText}>• Note any emotions you felt during the dream</Text>
          <Text style={styles.tipText}>• Mention any recurring symbols or themes</Text>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
    minHeight: 120,
  },
  analysisContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tipsContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
