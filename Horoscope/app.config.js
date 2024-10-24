export default {
    expo: {
        name: "Horoscope",
        slug: "horoscope",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "horoscope",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.yourcompany.horoscope"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.yourcompany.horoscope"
        },
        web: {
            favicon: "./assets/images/favicon.png",
            bundler: "metro",
            // Remove COOP and COEP headers to allow popup authentication
            headers: {
                "Cross-Origin-Opener-Policy": "unsafe-none",
                "Cross-Origin-Embedder-Policy": "unsafe-none"
            }
        },
        extra: {
            eas: {
                projectId: "your-project-id"
            }
        },
        scheme: "horoscope"
    }
};
