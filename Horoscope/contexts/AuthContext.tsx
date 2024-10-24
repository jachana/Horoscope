import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getUser, getAuthToken, storeAuthToken, storeUser, logout, useGoogleAuth } from '../services/authService';

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

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await getAuthToken();
            if (token) {
                const userData = await getUser();
                if (userData) {
                    setUser(userData);
                    setIsGuest(false);
                }
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async () => {
        try {
            const result = await promptAsync();

            if (result?.type === 'success') {
                const { authentication } = result;

                await storeAuthToken(authentication?.accessToken || '');

                const userInfoResponse = await fetch(
                    'https://www.googleapis.com/userinfo/v2/me',
                    {
                        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
                    }
                );

                const userData = await userInfoResponse.json();
                const user: User = {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    picture: userData.picture,
                };

                await storeUser(user);
                setUser(user);
                setIsGuest(false);
            }
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    const signInAsGuest = () => {
        setIsGuest(true);
        setUser(null);
    };

    const signOut = async () => {
        try {
            await logout();
            setUser(null);
            setIsGuest(false);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
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
