/**
 * config.js - Configuration file for QR Code Generator
 */

const Config = {
    // Application settings
    APP_NAME: 'PixelQR Generator',
    VERSION: '1.0.0',

    // QR Code settings
    QR_CODE: {
        DEFAULT_SIZE: 256,
        DEFAULT_ERROR_CORRECTION: 'M', // L, M, Q, H
        DEFAULT_MARGIN: 4,
        DEFAULT_COLOR_DARK: '#000000',
        DEFAULT_COLOR_LIGHT: '#FFFFFF',
        ALLOWED_ERROR_CORRECTION_LEVELS: ['L', 'M', 'Q', 'H'],
        MIN_SIZE: 64,
        MAX_SIZE: 1024
    },

    // Database settings
    DATABASE: {
        GITHUB_API_URL: 'https://api.github.com',
        REPO_NAME: 'pixel-qr-codes',
        USERNAME: 'pixel-qr-user',
        ACCESS_TOKEN: null,
        LOCAL_STORAGE_PREFIX: 'pixelQR_'
    },

    // UI settings
    UI: {
        NOTIFICATION_DURATION: 3000,
        ANIMATION_DURATION: 300,
        THEME: 'dark'
    },

    // Export settings
    EXPORT: {
        FORMATS: ['png', 'svg', 'pdf'],
        DEFAULT_FORMAT: 'png',
        INCLUDE_BORDER: true
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}