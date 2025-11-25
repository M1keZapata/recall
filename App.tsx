import React, { useState } from 'react';
import { Bookmark, Platform, MediaType } from './types';
import AddBookmark from './components/AddBookmark';
import BookmarkList from './components/BookmarkList';
import DailyRecap from './components/DailyRecap';
import { analyzeBookmarkMedia, fileToGenerativePart } from './services/gemini';
import { SparklesIcon } from './components/ui/Icons';

import { getThumbnailFromUrl } from './utils/thumbnail';
import { generateTitleFromUrl, generateDescriptionFromUrl } from './utils/titleGenerator';

// Mock data to start with (representing "Yesterday")
const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'mock-1',
    url: 'https://twitter.com/user/status/123',
    platform: 'twitter',
    mediaType: 'text',
    title: 'Thread on Productivity Systems',
    summary: 'A detailed breakdown of the GTD method applied to creative work.',
    tags: ['productivity', 'work', 'organization'],
    createdAt: Date.now() - 86400000, // 24h ago
    analysisStatus: 'completed'
  },
  {
    id: 'mock-2',
    url: 'https://instagram.com/p/xyz',
    platform: 'instagram',
    mediaType: 'image',
    title: 'Minimal Desk Setup',
    summary: 'Photo of a clean workspace with a mechanical keyboard and plants.',
    tags: ['design', 'workspace', 'minimalism'],
    createdAt: Date.now() - 86400000,
    analysisStatus: 'completed'
  },
  {
    id: 'mock-3',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    mediaType: 'video',
    title: 'Rick Astley - Never Gonna Give You Up',
    summary: 'The official video for Never Gonna Give You Up by Rick Astley.',
    tags: ['music', '80s', 'classic'],
    createdAt: Date.now() - 43200000,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    analysisStatus: 'completed'
  }
];

const App: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(INITIAL_BOOKMARKS);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddBookmark = async (url: string, platform: Platform, file: File | null, mediaType: MediaType) => {
    setIsProcessing(true);
    const newId = Date.now().toString();

    // Try to get a thumbnail from the URL
    const autoThumbnail = getThumbnailFromUrl(url);

    // Determine media type if we found a thumbnail and no file was uploaded
    let finalMediaType = mediaType;
    if (!file && autoThumbnail) {
      if (platform === 'youtube' || platform === 'tiktok') {
        finalMediaType = 'video';
      } else {
        finalMediaType = 'image';
      }
    }

    // Prepare initial bookmark object
    let newBookmark: Bookmark = {
      id: newId,
      url,
      platform,
      mediaType: finalMediaType,
      title: generateTitleFromUrl(url, platform),
      summary: generateDescriptionFromUrl(url, platform),
      tags: [],
      createdAt: Date.now(),
      thumbnailUrl: autoThumbnail || undefined,
      analysisStatus: 'pending'
    };

    if (file) {
      // Convert file to base64 for local preview
      try {
        const part = await fileToGenerativePart(file);
        newBookmark.mediaData = part.inlineData.data; // Store raw base64 for preview
      } catch (e) {
        console.error("Failed to read file", e);
      }
    }

    // Add to state immediately to show UI feedback
    setBookmarks(prev => [newBookmark, ...prev]);

    // Perform Gemini Analysis if media is present
    if (file) {
      // Update status to analyzing
      setBookmarks(prev => prev.map(b => b.id === newId ? { ...b, analysisStatus: 'analyzing' } : b));

      try {
        const analysis = await analyzeBookmarkMedia(file, url, mediaType === 'video' ? 'video' : 'image');

        // Update with Gemini results
        setBookmarks(prev => prev.map(b => b.id === newId ? {
          ...b,
          title: analysis.title,
          summary: analysis.summary,
          tags: analysis.tags,
          analysisStatus: 'completed'
        } : b));

      } catch (error) {
        console.error("Analysis failed", error);
        setBookmarks(prev => prev.map(b => b.id === newId ? { ...b, analysisStatus: 'failed' } : b));
      }
    } else {
      // For text-only (mock), just complete it
      setBookmarks(prev => prev.map(b => b.id === newId ? { ...b, analysisStatus: 'completed' } : b));
    }

    setIsProcessing(false);
  };

  return (
    <>
      {/* Animated Background */}
      <div className="app-background"></div>

      <div className="min-h-screen font-sans pb-20 relative">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-2xl tracking-tight text-gradient">Recall</h1>
                <p className="text-xs text-slate-400">Intelligent Memory</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white/20 overflow-hidden shadow-lg">
              <img src="https://picsum.photos/100/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* Connection/Recap Section */}
          <DailyRecap bookmarks={bookmarks} />

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
              <h2 className="text-lg font-bold text-slate-300 uppercase tracking-wider text-sm">Add to Memory</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
            </div>
            <AddBookmark onAdd={handleAddBookmark} isProcessing={isProcessing} />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Recent Bookmarks
              </h2>
              <span className="text-xs font-semibold text-orange-300 bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {bookmarks.length} items
              </span>
            </div>
            <BookmarkList bookmarks={bookmarks} />
          </div>

        </main>
      </div>
    </>
  );
};

export default App;
