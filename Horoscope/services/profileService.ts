import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
    userId: string;
    zodiacSign?: string;
    birthDate?: string;
    birthTime?: string;
    placeOfBirth?: string;
    heritage?: string;
    relationshipStatus?: string;
    lifeGoals?: string;
    preferences?: {
        notifications: boolean;
        theme: 'light' | 'dark' | 'system';
    };
    subscription: {
        tier: SubscriptionTier;
        expiresAt?: string; // ISO date string
    };
    lastUpdated: string;
}

const PROFILE_KEY_PREFIX = 'user_profile_';

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

const getProfileKey = (userId: string) => `${PROFILE_KEY_PREFIX}${userId}`;

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
    try {
        console.log('[Profile Debug] Saving profile for user:', profile.userId);
        const key = getProfileKey(profile.userId);

        // Ensure subscription is set with at least a default value
        const profileWithSubscription = {
            ...profile,
            subscription: profile.subscription || { tier: 'free' },
            lastUpdated: new Date().toISOString()
        };

        await storage.setItem(key, JSON.stringify(profileWithSubscription));
        console.log('[Profile Debug] Profile saved successfully');
    } catch (error) {
        console.error('[Profile Debug] Error saving profile:', error);
        throw error;
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        console.log('[Profile Debug] Retrieving profile for user:', userId);
        const key = getProfileKey(userId);
        const profileData = await storage.getItem(key);

        if (!profileData) {
            console.log('[Profile Debug] No profile found for user');
            return null;
        }

        const profile = JSON.parse(profileData);

        // Ensure subscription exists in older profiles
        if (!profile.subscription) {
            profile.subscription = { tier: 'free' };
        }

        console.log('[Profile Debug] Profile retrieved successfully');
        return profile;
    } catch (error) {
        console.error('[Profile Debug] Error retrieving profile:', error);
        return null;
    }
};

export const updateUserProfile = async (
    userId: string,
    updates: Partial<Omit<UserProfile, 'userId' | 'lastUpdated'>>
): Promise<UserProfile> => {
    try {
        console.log('[Profile Debug] Updating profile for user:', userId);
        const currentProfile = await getUserProfile(userId);

        // Ensure we have a valid current profile
        const baseProfile: UserProfile = currentProfile || {
            userId,
            subscription: { tier: 'free' },
            lastUpdated: new Date().toISOString()
        };

        // Handle subscription updates carefully
        const updatedSubscription = updates.subscription
            ? {
                tier: updates.subscription.tier || baseProfile.subscription.tier,
                expiresAt: updates.subscription.expiresAt
            }
            : baseProfile.subscription;

        const updatedProfile: UserProfile = {
            ...baseProfile,
            ...updates,
            subscription: updatedSubscription,
            lastUpdated: new Date().toISOString()
        };

        await saveUserProfile(updatedProfile);
        console.log('[Profile Debug] Profile updated successfully');
        return updatedProfile;
    } catch (error) {
        console.error('[Profile Debug] Error updating profile:', error);
        throw error;
    }
};

export const deleteUserProfile = async (userId: string): Promise<void> => {
    try {
        console.log('[Profile Debug] Deleting profile for user:', userId);
        const key = getProfileKey(userId);
        await storage.deleteItem(key);
        console.log('[Profile Debug] Profile deleted successfully');
    } catch (error) {
        console.error('[Profile Debug] Error deleting profile:', error);
        throw error;
    }
};

export const checkSubscriptionAccess = (profile: UserProfile | null): boolean => {
    if (!profile) return false;

    const { subscription } = profile;
    if (subscription.tier === 'premium') {
        // If there's an expiration date, check if it's still valid
        if (subscription.expiresAt) {
            return new Date(subscription.expiresAt) > new Date();
        }
        return true; // Premium with no expiration
    }
    return false; // Free tier
};
