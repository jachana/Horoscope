import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ENV } from '../config/env';

const AUTH_KEY = 'auth_token';
const USER_KEY = 'user_data';

WebBrowser.maybeCompleteAuthSession();

export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

export const useGoogleAuth = () => {
    const clientId = Platform.select({
        ios: ENV.GOOGLE_IOS_CLIENT_ID,
        android: ENV.GOOGLE_ANDROID_CLIENT_ID,
        default: ENV.GOOGLE_CLIENT_ID,
    });

    // Add more detailed debug logging
    console.log('[Auth Debug] Environment:', {
        platform: Platform.OS,
        clientId,
        webRedirectUri: window.location.origin
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId,
        scopes: ['profile', 'email'],
        redirectUri: Platform.select({
            // Use the current origin for web
            web: window.location.origin,
            default: undefined,
        }),
        // Configure auth based on platform
        ...(Platform.OS === 'web' ? {
            responseType: "id_token",
            usePKCE: false,
            // Use Google's own popup mechanism
            customParams: {
                prompt: "select_account",
                access_type: "online",
            }
        } : {
            responseType: "code",
            usePKCE: true
        })
    });

    if (request) {
        console.log('[Auth Debug] Auth request configured:', {
            url: request.url,
            scopes: request.scopes,
            clientId: request.clientId,
            redirectUri: request.redirectUri,
            responseType: request.responseType,
            usePKCE: request.usePKCE
        });
    }

    if (response) {
        console.log('[Auth Debug] Auth response received:', {
            type: response.type,
            params: response.type === 'success' ? response.authentication : null,
        });
    }

    return {
        request,
        response,
        promptAsync: async () => {
            try {
                console.log('[Auth Debug] Initiating Google Auth prompt...');
                // For web, use a popup window with correct type
                const options = Platform.OS === 'web' ? {
                    windowFeatures: {
                        width: 600,
                        height: 700,
                        centerScreen: true
                    }
                } : undefined;

                const result = await promptAsync(options);
                console.log('[Auth Debug] Prompt result:', {
                    type: result.type,
                    params: result.type === 'success' ? result.authentication : null,
                });
                return result;
            } catch (error) {
                console.error('[Auth Debug] Prompt error:', error);
                throw error;
            }
        },
    };
};

const isWeb = Platform.OS === 'web';

// Web storage fallback
const webStorage = {
    setItem: (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getItem: (key: string) => {
        try {
            const value = localStorage.getItem(key);
            return Promise.resolve(value);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    deleteItem: (key: string) => {
        try {
            localStorage.removeItem(key);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

// Storage interface that works across platforms
const storage = {
    setItem: async (key: string, value: string) => {
        if (isWeb) {
            return webStorage.setItem(key, value);
        }
        return SecureStore.setItemAsync(key, value);
    },
    getItem: async (key: string) => {
        if (isWeb) {
            return webStorage.getItem(key);
        }
        return SecureStore.getItemAsync(key);
    },
    deleteItem: async (key: string) => {
        if (isWeb) {
            return webStorage.deleteItem(key);
        }
        return SecureStore.deleteItemAsync(key);
    }
};

export const storeAuthToken = async (token: string) => {
    try {
        console.log('[Auth Debug] Storing auth token...');
        await storage.setItem(AUTH_KEY, token);
        console.log('[Auth Debug] Auth token stored successfully');
    } catch (error) {
        console.error('[Auth Debug] Error storing auth token:', error);
        throw error;
    }
};

export const getAuthToken = async () => {
    try {
        console.log('[Auth Debug] Retrieving auth token...');
        const token = await storage.getItem(AUTH_KEY);
        console.log('[Auth Debug] Auth token retrieved:', token ? 'Found' : 'Not found');
        return token;
    } catch (error) {
        console.error('[Auth Debug] Error getting auth token:', error);
        return null;
    }
};

export const storeUser = async (user: User) => {
    try {
        console.log('[Auth Debug] Storing user data...');
        await storage.setItem(USER_KEY, JSON.stringify(user));
        console.log('[Auth Debug] User data stored successfully');
    } catch (error) {
        console.error('[Auth Debug] Error storing user data:', error);
        throw error;
    }
};

export const getUser = async (): Promise<User | null> => {
    try {
        console.log('[Auth Debug] Retrieving user data...');
        const userData = await storage.getItem(USER_KEY);
        console.log('[Auth Debug] User data retrieved:', userData ? 'Found' : 'Not found');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('[Auth Debug] Error getting user data:', error);
        return null;
    }
};

export const logout = async () => {
    try {
        console.log('[Auth Debug] Logging out...');
        await storage.deleteItem(AUTH_KEY);
        await storage.deleteItem(USER_KEY);
        console.log('[Auth Debug] Logout successful');
    } catch (error) {
        console.error('[Auth Debug] Error during logout:', error);
        throw error;
    }
};
