import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';

export default function ReadingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Extended Readings</Text>
        <Text style={styles.subtitle}>Weekly and Monthly Astrological Insights</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.readingCard}>
          <Text style={styles.cardTitle}>Weekly Reading</Text>
          <Text style={styles.cardDescription}>
            Get a detailed forecast for the upcoming week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.readingCard}>
          <Text style={styles.cardTitle}>Monthly Reading</Text>
          <Text style={styles.cardDescription}>
            Discover major astrological influences for the month ahead
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About Extended Readings</Text>
          <Text style={styles.infoText}>
            Our extended readings use advanced astrological calculations and AI 
            to provide deeper insights into your future. Select your preferred 
            timeframe above to begin.
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
