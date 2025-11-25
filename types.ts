export type Platform = 'twitter' | 'instagram' | 'tiktok' | 'web' | 'youtube' | 'facebook' | 'linkedin' | 'reddit';

export type MediaType = 'image' | 'video' | 'text';

export interface Bookmark {
  id: string;
  url: string;
  platform: Platform;
  mediaType: MediaType;
  title?: string;
  summary?: string;
  tags: string[];
  createdAt: number; // timestamp
  mediaData?: string; // base64 for preview
  thumbnailUrl?: string; // URL for remote thumbnail
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'failed';
}

export interface ConnectionInsight {
  title: string;
  description: string;
  relatedBookmarkIds: string[];
}

export interface DailyDigest {
  date: string;
  summary: string;
  insights: ConnectionInsight[];
}
