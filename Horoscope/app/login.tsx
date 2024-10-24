import { StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useState, useEffect } from 'react';

export default function LoginScreen() {
    const { signIn, signInAsGuest, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Redirect to tabs if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log('[Login Debug] User is authenticated, navigating to tabs');
            router.replace('/(tabs)');
        }
    }, [isAuthenticated]);

    const handleLogin = async () => {
        try {
            console.log('[Login Debug] Starting login process...');
            setIsLoading(true);
            await signIn();
            console.log('[Login Debug] Sign in completed successfully');
        } catch (error) {
            console.error('[Login Debug] Login failed:', error);
            Alert.alert(
                'Authentication Failed',
                'Unable to sign in with Google. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = () => {
        console.log('[Login Debug] Starting guest login...');
        signInAsGuest();
    };

    return (
        <ThemedView style={styles.container}>
            <Image
                source={require('../assets/images/zodiac-placeholder.png')}
                style={styles.logo}
            />
            <ThemedText style={styles.title}>Welcome to Horoscope</ThemedText>
            <ThemedText style={styles.subtitle}>
                Sign in to save your preferences and get personalized readings
            </ThemedText>

            <TouchableOpacity
                style={[styles.googleButton, isLoading && styles.googleButton_disabled]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#000" style={styles.buttonContent} />
                ) : (
                        <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
                disabled={isLoading}
            >
                <ThemedText style={[
                    styles.guestButtonText,
                    isLoading && styles.guestButtonText_disabled
                ]}>
                    Continue as Guest
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.8,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 15,
        width: '80%',
        justifyContent: 'center',
    },
    googleButton_disabled: {
        backgroundColor: '#D3D3D3',
        opacity: 0.7,
    },
    buttonContent: {
        height: 24,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
    },
    guestButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    guestButtonText: {
        fontSize: 16,
        opacity: 0.6,
        textDecorationLine: 'underline',
    },
    guestButtonText_disabled: {
        opacity: 0.3,
    },
});
