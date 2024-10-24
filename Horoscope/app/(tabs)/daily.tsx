import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { ZodiacImage } from '../../components/ZodiacImage';
import { useHoroscope } from '../../hooks/useHoroscope';
import { FontAwesome } from '@expo/vector-icons';

export default function DailyHoroscopeScreen() {
    const { loading, error, reading, getReading } = useHoroscope();

    useEffect(() => {
        getReading('Aries'); // This will need to be updated to use the zodiac sign from profile
    }, []);

    const handleRefresh = () => {
        getReading('Aries'); // This will need to be updated to use the zodiac sign from profile
    };

    const backgroundImage = require('../../assets/images/Backgrounds/Aries.jpg');

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Daily Horoscope</Text>
                    <Text style={styles.subtitle}>Your Daily Celestial Guidance</Text>
                </View>

                <View style={styles.readingContainer}>
                    <View style={styles.readingHeader}>
                        <Text style={styles.readingTitle}>Your Daily Reading</Text>
                        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                            <FontAwesome name="refresh" size={20} color="#6B4DE6" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.selectedSignHeader}>
                        <ZodiacImage sign="Aries" size={32} /> {/* This will need to be updated */}
                        <Text style={styles.selectedSignText}>Aries</Text> {/* This will need to be updated */}
                    </View>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#6B4DE6" />
                            <Text style={styles.loadingText}>Consulting the stars...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : reading ? (
                        <Text style={styles.readingText}>{reading.reading}</Text>
                    ) : (
                        <Text style={styles.readingText}>Set your birthday in the profile tab to see your horoscope</Text>
                    )}
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
        backgroundColor: 'rgba(107, 77, 230, 0.8)', // Semi-transparent purple
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
    readingContainer: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // More opaque white
        margin: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    readingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    readingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    refreshButton: {
        padding: 8,
    },
    selectedSignHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 248, 248, 0.9)',
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
    loadingContainer: {
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: '#6B4DE6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
