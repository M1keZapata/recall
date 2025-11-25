export const getThumbnailFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        // YouTube
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            let videoId = '';

            if (hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.searchParams.has('v')) {
                videoId = urlObj.searchParams.get('v') || '';
            } else if (urlObj.pathname.includes('/embed/')) {
                videoId = urlObj.pathname.split('/embed/')[1];
            } else if (urlObj.pathname.includes('/v/')) {
                videoId = urlObj.pathname.split('/v/')[1];
            }

            if (videoId) {
                // Use high quality thumbnail
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }

        // Add other platforms here as needed
        // For example, Vimeo, etc.

        return null;
    } catch (e) {
        console.error('Error parsing URL for thumbnail:', e);
        return null;
    }
};
