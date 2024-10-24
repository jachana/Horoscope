import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { ZodiacImage } from '../../components/ZodiacImage';
import { useHoroscope } from '../../hooks/useHoroscope';
import { FontAwesome } from '@expo/vector-icons';

const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>{title}</Text>
        {children}
    </View>
);

export default function DailyHoroscopeScreen() {
    const { loading, error, reading, getReading } = useHoroscope();

    useEffect(() => {
        getReading('Aries'); // This will need to be updated to use the zodiac sign from profile
    }, []);

    const handleRefresh = () => {
        getReading('Aries'); // This will need to be updated to use the zodiac sign from profile
    };

    const backgroundImage = require('../../assets/images/Backgrounds/Aries.jpg');

    const renderExtraInfo = () => {
        if (!reading) return null;

        return (
            <>
                <InfoSection title="Lucky Numbers">
                    <View style={styles.numbersContainer}>
                        {reading.luckyNumbers.map((number, index) => (
                            <View key={index} style={styles.numberBubble}>
                                <Text style={styles.numberText}>{number}</Text>
                            </View>
                        ))}
                    </View>
                </InfoSection>

                <InfoSection title="Planetary Positions">
                    {reading.planetaryPositions.map((position, index) => (
                        <View key={index} style={styles.planetRow}>
                            <Text style={styles.planetName}>{position.planet}</Text>
                            <Text style={styles.planetPosition}>{position.position}</Text>
                        </View>
                    ))}
                </InfoSection>

                <InfoSection title="Compatible Signs">
                    <View style={styles.compatibleSignsContainer}>
                        {reading.compatibleSigns.map((sign, index) => (
                            <View key={index} style={styles.compatibleSignBubble}>
                                <ZodiacImage sign={sign} size={24} />
                                <Text style={styles.compatibleSignText}>{sign}</Text>
                            </View>
                        ))}
                    </View>
                </InfoSection>

                <InfoSection title="Lucky Color">
                    <View style={styles.colorContainer}>
                        <View style={[styles.colorBox, { backgroundColor: reading.luckyColor.toLowerCase() }]} />
                        <Text style={styles.colorText}>{reading.luckyColor}</Text>
                    </View>
                </InfoSection>

                <InfoSection title="Best Time for Decisions">
                    <Text style={styles.timeText}>{reading.bestTimeForDecisions}</Text>
                </InfoSection>
            </>
        );
    };

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
                        <ZodiacImage sign="Aries" size={32} />
                        <Text style={styles.selectedSignText}>Aries</Text>
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
                                <>
                                    <Text style={styles.readingText}>{reading.reading}</Text>
                                    {renderExtraInfo()}
                                </>
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    header: {
        padding: 20,
        backgroundColor: 'rgba(107, 77, 230, 0.8)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
        marginBottom: 20,
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
    infoSection: {
        marginTop: 15,
        padding: 15,
        backgroundColor: 'rgba(248, 248, 248, 0.9)',
        borderRadius: 8,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    numbersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    numberBubble: {
        backgroundColor: '#6B4DE6',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    planetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    planetName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    planetPosition: {
        fontSize: 16,
        color: '#666',
    },
    compatibleSignsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    compatibleSignBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 8,
        paddingRight: 12,
    },
    compatibleSignText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#333',
    },
    colorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorBox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    colorText: {
        fontSize: 16,
        color: '#333',
    },
    timeText: {
        fontSize: 16,
        color: '#333',
    },
});
