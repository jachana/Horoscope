import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen() {
    const { user, signOut, isGuest } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSignIn = () => {
        router.replace('/login');
    };

    if (isGuest) {
        return (
            <ThemedView style={styles.container}>
                <ThemedView style={styles.profileHeader}>
                    <ThemedView style={styles.profileImagePlaceholder}>
                        <FontAwesome name="user" size={40} color="#666" />
                    </ThemedView>
                    <ThemedText style={styles.name}>Guest User</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Sign in to save your preferences and get personalized readings
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.settingsSection}>
                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleSignIn}
                    >
                        <FontAwesome name="sign-in" size={20} color="#007AFF" />
                        <ThemedText style={styles.signInText}>Sign In</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <FontAwesome name="sign-out" size={20} color="#FF3B30" />
                        <ThemedText style={styles.logoutText}>Exit Guest Mode</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.profileHeader}>
                {user?.picture ? (
                    <Image
                        source={{ uri: user.picture }}
                        style={styles.profileImage}
                    />
                ) : (
                    <ThemedView style={styles.profileImagePlaceholder}>
                        <FontAwesome name="user" size={40} color="#666" />
                    </ThemedView>
                )}
                <ThemedText style={styles.name}>{user?.name}</ThemedText>
                <ThemedText style={styles.email}>{user?.email}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.settingsSection}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <FontAwesome name="sign-out" size={20} color="#FF3B30" />
                    <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.subscriptionSection}>
              <ThemedText style={styles.subscriptionTitle}>Subscription</ThemedText>
              <ThemedText style={styles.subscriptionStatus}>
                Current plan: {user?.subscription?.tier === 'premium' ? 'Premium' : 'Free'}
              </ThemedText>
              {user?.subscription?.tier !== 'premium' && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => router.push('/upgrade')}
                >
                  <ThemedText style={styles.upgradeButtonText}>Upgrade to Premium</ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E1E1E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        opacity: 0.7,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    settingsSection: {
        marginTop: 20,
        gap: 10,
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 10,
    },
    signInText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 10,
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '600',
    },
    subscriptionSection: {
      marginTop: 20,
      padding: 15,
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      borderRadius: 10,
    },
    subscriptionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subscriptionStatus: {
      fontSize: 16,
      marginBottom: 10,
    },
    upgradeButton: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    upgradeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
});
