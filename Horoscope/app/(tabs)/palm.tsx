import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { PremiumFeature } from '../../components/PremiumFeature';
import { getPalmReading, PalmReading } from '../../services/palmReadingService';

export default function PalmReadingScreen() {
    const [reading, setReading] = useState<PalmReading | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPalmReading();
    }, []);

    const loadPalmReading = async () => {
        try {
            const newReading = await getPalmReading();
            setReading(newReading);
        } catch (error) {
            console.error('Error loading palm reading:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PremiumFeature>
            <ScrollView style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                ) : reading ? (
                    <View style={styles.readingContainer}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
});
