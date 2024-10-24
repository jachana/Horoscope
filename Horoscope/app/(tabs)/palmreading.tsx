import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function PalmReadingScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Palm Reading</Text>
        <Text style={styles.subtitle}>Discover your life path through palmistry</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.uploadButton}>
          <FontAwesome name="camera" size={24} color="#6B4DE6" />
          <Text style={styles.uploadText}>Take a Photo of Your Palm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton}>
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
});
