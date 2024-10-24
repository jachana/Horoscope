import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function LoginScreen() {
    const { signIn, signInAsGuest } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signIn();
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleGuestLogin = () => {
        signInAsGuest();
        router.replace('/(tabs)');
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
                style={styles.googleButton_disabled}

                onPress={handleLogin}
                disabled={true} // Set this to true when loading
            >
                <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
            >
                <ThemedText style={styles.guestButtonText}>Continue as Guest</ThemedText>
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D3D3D3', // Light grey color
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
        opacity: 0.7, // Slightly reduce opacity to emphasize disabled state
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
});
