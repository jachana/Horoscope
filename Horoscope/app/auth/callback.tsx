import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { ThemedText } from '../../components/ThemedText';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        // The auth response will be handled by expo-auth-session
        // This page is just a fallback in case the automatic handling fails
        console.log('[Auth Debug] On callback page, redirecting...');
        router.replace('/');
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <ThemedText style={{ marginTop: 20 }}>
                Completing authentication...
            </ThemedText>
        </View>
    );
}
