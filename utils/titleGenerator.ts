import { Platform } from '../types';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const generateTitleFromUrl = (url: string, platform: Platform): string => {
    try {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);

        switch (platform) {
            case 'instagram':
                // Handle /p/postId or /username
                if (pathSegments[0] === 'p' || pathSegments[0] === 'reel') {
                    return `Instagram ${pathSegments[0] === 'p' ? 'Post' : 'Reel'}`;
                } else if (pathSegments.length > 0) {
                    return `Instagram - ${capitalize(pathSegments[0])}`;
                }
                return 'Instagram Link';

            case 'twitter':
                // Handle /username/status/id or /username
                if (pathSegments.length > 0) {
                    return `X - ${capitalize(pathSegments[0])}`;
                }
                return 'X / Twitter Link';

            case 'youtube':
                // YouTube is hard to get title from URL alone without API, 
                // but we can try to make it cleaner than the URL
                if (urlObj.searchParams.has('v')) {
                    return 'YouTube Video';
                } else if (pathSegments[0] === 'shorts') {
                    return 'YouTube Short';
                } else if (pathSegments.length > 0 && !['watch', 'embed', 'v'].includes(pathSegments[0])) {
                    // Likely a channel
                    return `YouTube - ${capitalize(pathSegments[0])}`;
                }
                return 'YouTube Video';

            case 'tiktok':
                // Handle /@username/video/id
                if (pathSegments.length > 0 && pathSegments[0].startsWith('@')) {
                    return `TikTok - ${capitalize(pathSegments[0].substring(1))}`;
                }
                return 'TikTok Video';

            case 'linkedin':
                if (pathSegments[0] === 'in' && pathSegments[1]) {
                    return `LinkedIn - ${capitalize(pathSegments[1])}`;
                }
                return 'LinkedIn Post';

            case 'reddit':
                if (pathSegments[0] === 'r' && pathSegments[1]) {
                    return `Reddit - r/${capitalize(pathSegments[1])}`;
                }
                return 'Reddit Post';

            case 'facebook':
                return 'Facebook Post';

            default:
                // Generic fallback: Domain + First Path Segment
                const domain = urlObj.hostname.replace('www.', '');
                if (pathSegments.length > 0) {
                    // Capitalize first letter of path for better readability
                    const segment = pathSegments[pathSegments.length - 1];
                    const formattedSegment = segment.replace(/-/g, ' ').replace(/_/g, ' ');
                    return `${domain} - ${capitalize(formattedSegment)}`;
                }
                return domain;
        }
    } catch (e) {
        return url;
    }
};

export const generateDescriptionFromUrl = (url: string, platform: Platform): string => {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');

        switch (platform) {
            case 'instagram':
                return 'View this post on Instagram';
            case 'twitter':
                return 'View this post on X / Twitter';
            case 'youtube':
                return 'Watch this video on YouTube';
            case 'tiktok':
                return 'Watch this video on TikTok';
            case 'linkedin':
                return 'View this post on LinkedIn';
            case 'reddit':
                return 'View this discussion on Reddit';
            case 'facebook':
                return 'View this post on Facebook';
            default:
                return `Visit ${domain} to view this content`;
        }
    } catch (e) {
        return 'Click to view content';
    }
};
