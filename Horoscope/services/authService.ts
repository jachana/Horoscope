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

    console.log('[Auth Debug] Using client ID:', clientId);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId,
        scopes: ['profile', 'email'],
        redirectUri: Platform.select({
            web: 'http://localhost:19006', // Default Expo web port
            default: undefined, // Let Expo handle mobile redirects
        }),
    });

    if (request) {
        console.log('[Auth Debug] Auth request configured:', {
            url: request.url,
            scopes: request.scopes,
            clientId: request.clientId,
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
                const result = await promptAsync();
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

export const storeAuthToken = async (token: string) => {
    try {
        console.log('[Auth Debug] Storing auth token...');
        await SecureStore.setItem(AUTH_KEY, token);
        console.log('[Auth Debug] Auth token stored successfully');
    } catch (error) {
        console.error('[Auth Debug] Error storing auth token:', error);
        throw error;
    }
};

export const getAuthToken = async () => {
    try {
        console.log('[Auth Debug] Retrieving auth token...');
        const token = await SecureStore.getItem(AUTH_KEY);
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
        await SecureStore.setItem(USER_KEY, JSON.stringify(user));
        console.log('[Auth Debug] User data stored successfully');
    } catch (error) {
        console.error('[Auth Debug] Error storing user data:', error);
        throw error;
    }
};

export const getUser = async (): Promise<User | null> => {
    try {
        console.log('[Auth Debug] Retrieving user data...');
        const userData = await SecureStore.getItem(USER_KEY);
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
        await SecureStore.deleteItem(AUTH_KEY);
        await SecureStore.deleteItem(USER_KEY);
        console.log('[Auth Debug] Logout successful');
    } catch (error) {
        console.error('[Auth Debug] Error during logout:', error);
        throw error;
    }
};
