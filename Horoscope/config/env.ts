export const ENV = {
    OPENROUTER_API_KEY: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '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',
    OPENROUTER_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    // Web client ID
    GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '780482521590-567m3l1a8113g927l58p73jmo4ctsrgd.apps.googleusercontent.com',
    // Android client ID - should match the one in your Google Cloud Console
    GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '780482521590-567m3l1a8113g927l58p73jmo4ctsrgd.apps.googleusercontent.com',
    // iOS client ID - should match the one in your Google Cloud Console
    GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '780482521590-567m3l1a8113g927l58p73jmo4ctsrgd.apps.googleusercontent.com',
};
