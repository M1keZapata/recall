import React from 'react';
import { Bookmark } from '../types';
import { VideoCameraIcon, PhotoIcon, SparklesIcon } from './ui/Icons';

import { generateDescriptionFromUrl } from '../utils/titleGenerator';

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="glass-card text-center py-16 animate-fade-in">
        <SparklesIcon className="w-16 h-16 text-orange-500/30 mx-auto mb-4" />
        <p className="text-slate-400 font-medium text-lg">No memories saved yet.</p>
        <p className="text-slate-500 text-sm mt-2">Start by adding your first bookmark above</p>
      </div>
    );
  }

  return (
    <div className="bookmark-carousel-container">
      <div className="bookmark-carousel">
        {bookmarks.map((b, index) => (
          <div
            key={b.id}
            className="bookmark-card"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Thumbnail / Icon */}
            <div className="bookmark-thumbnail">
              {b.mediaData || b.thumbnailUrl ? (
                b.mediaType === 'video' ? (
                  <div className="relative w-full h-full bg-black">
                    {b.mediaData ? (
                      <video src={`data:video/mp4;base64,${b.mediaData}`} className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <img src={b.thumbnailUrl} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                    )}
                  </div>
                ) : (
                  <img
                    src={b.mediaData ? `data:${b.mediaType}/jpeg;base64,${b.mediaData}` : b.thumbnailUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            {/* Content */}
            <div className="bookmark-content">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-orange-300 transition-colors">
                  {b.title || b.url}
                </h3>
                <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
                  {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>



              {b.summary ? (
                <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">{b.summary}</p>
              ) : (
                b.analysisStatus === 'analyzing' ?
                  <p className="text-sm text-orange-400 mt-2 animate-pulse flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Gemini is analyzing...</span>
                  </p> :
                  <p className="text-sm text-slate-500 mt-2 italic">
                    {generateDescriptionFromUrl(b.url, b.platform)}
                  </p>
              )}

              <div className="mt-auto pt-4 flex flex-wrap gap-2">
                {/* Platform Tag */}
                <span className="card-tag capitalize">
                  {b.platform}
                </span>

                {/* Media Type Tag */}
                <span className="card-tag capitalize">
                  {b.mediaType}
                </span>

                {/* Custom Tags */}
                {b.tags.map(tag => (
                  <span key={tag} className="card-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
