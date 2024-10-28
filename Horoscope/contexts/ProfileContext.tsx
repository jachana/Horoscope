import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, getUserProfile, updateUserProfile } from '../services/profileService';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

interface ProfileContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    updateProfile: (updates: Partial<Omit<UserProfile, 'userId' | 'lastUpdated'>>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    isLoading: true,
    updateProfile: async () => { },
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            loadProfile(user.id);
        } else {
            setProfile(null);
            setIsLoading(false);
        }
    }, [isAuthenticated, user?.id]);

    const loadProfile = async (userId: string) => {
        try {
            console.log('[Profile Debug] Loading profile...');
            setIsLoading(true);
            const userProfile = await getUserProfile(userId);

            if (userProfile) {
                console.log('[Profile Debug] Profile loaded successfully');
                setProfile(userProfile);
            } else {
                // Initialize empty profile if none exists
                const newProfile: UserProfile = {
                    userId,
                    subscription: { tier: 'free' }, // Initialize with free tier
                    lastUpdated: new Date().toISOString()
                };
                setProfile(newProfile);
            }
        } catch (error) {
            console.error('[Profile Debug] Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfileData = async (updates: Partial<Omit<UserProfile, 'userId' | 'lastUpdated'>>) => {
        try {
            if (!user?.id) {
                throw new Error('No authenticated user');
            }

            console.log('[Profile Debug] Updating profile...', updates);
            const updatedProfile = await updateUserProfile(user.id, updates);
            setProfile(updatedProfile);
            console.log('[Profile Debug] Profile updated successfully');
        } catch (error) {
            console.error('[Profile Debug] Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
            throw error;
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profile,
                isLoading,
                updateProfile: updateProfileData,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, getUserProfile } from '../services/profileService';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    };

    loadProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
