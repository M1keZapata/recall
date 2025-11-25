import { Platform } from '../types';

/**
 * Detects the platform based on the URL
 * @param url - The URL to analyze
 * @returns The detected platform or 'web' as default
 */
export function detectPlatformFromUrl(url: string): Platform {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        // Twitter / X
        if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
            return 'twitter';
        }

        // Instagram
        if (hostname.includes('instagram.com')) {
            return 'instagram';
        }

        // TikTok
        if (hostname.includes('tiktok.com')) {
            return 'tiktok';
        }

        // YouTube
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            return 'youtube';
        }

        // Facebook
        if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
            return 'facebook';
        }

        // LinkedIn
        if (hostname.includes('linkedin.com')) {
            return 'linkedin';
        }

        // Reddit
        if (hostname.includes('reddit.com')) {
            return 'reddit';
        }

        // Default to web for any other URL
        return 'web';
    } catch (error) {
        // If URL parsing fails, default to web
        return 'web';
    }
}

/**
 * Gets a display name for the platform
 * @param platform - The platform identifier
 * @returns A user-friendly display name
 */
export function getPlatformDisplayName(platform: Platform): string {
    const displayNames: Record<Platform, string> = {
        web: 'Web Article',
        twitter: 'X / Twitter',
        instagram: 'Instagram',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        facebook: 'Facebook',
        linkedin: 'LinkedIn',
        reddit: 'Reddit'
    };

    return displayNames[platform] || 'Web';
}
