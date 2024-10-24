import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getUser, getAuthToken, storeAuthToken, storeUser, logout, useGoogleAuth } from '../services/authService';
import { Alert } from 'react-native';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isGuest: boolean;
    signIn: () => Promise<void>;
    signInAsGuest: () => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isGuest: false,
    signIn: async () => { },
    signInAsGuest: () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const { promptAsync } = useGoogleAuth();

    // Load user data on mount
    useEffect(() => {
        loadUser();
    }, []);

    // Debug effect to monitor auth state changes
    useEffect(() => {
        console.log('[Auth Debug] Auth state updated:', {
            user: user?.email,
            isAuthenticated: !!user || isGuest,
            isGuest,
            isLoading
        });
    }, [user, isGuest, isLoading]);

    const loadUser = async () => {
        try {
            console.log('[Auth Debug] Loading user data...');
            const token = await getAuthToken();
            if (token) {
                const userData = await getUser();
                if (userData) {
                    console.log('[Auth Debug] User data loaded successfully:', userData.email);
                    setUser(userData);
                    setIsGuest(false);
                } else {
                    console.log('[Auth Debug] No user data found');
                    await logout(); // Clear invalid token
                }
            }
        } catch (error) {
            console.error('[Auth Debug] Error loading user:', error);
            Alert.alert('Error', 'Failed to load user data. Please try logging in again.');
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async () => {
        try {
            setIsLoading(true);
            console.log('[Auth Debug] Starting Google sign in...');

            const result = await promptAsync();
            console.log('[Auth Debug] Google sign in result:', result.type);

            if (result?.type === 'success') {
                const { authentication } = result;

                if (!authentication?.accessToken) {
                    throw new Error('No access token received');
                }

                console.log('[Auth Debug] Storing auth token...');
                await storeAuthToken(authentication.accessToken);

                console.log('[Auth Debug] Fetching user info...');
                const userInfoResponse = await fetch(
                    'https://www.googleapis.com/userinfo/v2/me',
                    {
                        headers: { Authorization: `Bearer ${authentication.accessToken}` },
                    }
                );

                if (!userInfoResponse.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const userData = await userInfoResponse.json();
                console.log('[Auth Debug] User info received:', userData.email);

                const user: User = {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    picture: userData.picture,
                };

                console.log('[Auth Debug] Storing user data...');
                await storeUser(user);
                setUser(user);
                setIsGuest(false);
            } else {
                console.log('[Auth Debug] Authentication cancelled or failed');
                throw new Error('Authentication cancelled or failed');
            }
        } catch (error) {
            console.error('[Auth Debug] Sign in error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInAsGuest = () => {
        console.log('[Auth Debug] Signing in as guest');
        setIsGuest(true);
        setUser(null);
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            console.log('[Auth Debug] Signing out...');
            await logout();
            setUser(null);
            setIsGuest(false);
        } catch (error) {
            console.error('[Auth Debug] Error signing out:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user || isGuest,
                isGuest,
                signIn,
                signInAsGuest,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
