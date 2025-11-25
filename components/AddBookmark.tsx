import React, { useState, useRef, useEffect } from 'react';
import { Platform, MediaType } from '../types';
import { PhotoIcon, VideoCameraIcon, LinkIcon, PlusIcon, SparklesIcon } from './ui/Icons';
import { detectPlatformFromUrl, getPlatformDisplayName } from '../utils/platformDetection';

interface AddBookmarkProps {
  onAdd: (url: string, platform: Platform, file: File | null, mediaType: MediaType) => void;
  isProcessing: boolean;
}

const AddBookmark: React.FC<AddBookmarkProps> = ({ onAdd, isProcessing }) => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>('web');
  const [file, setFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically detect platform when URL changes
  useEffect(() => {
    if (url) {
      const detectedPlatform = detectPlatformFromUrl(url);
      setPlatform(detectedPlatform);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onAdd(url, platform, file, mediaType);
      setUrl('');
      setFile(null);
      setMediaType('text');
      setPlatform('web');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      if (selectedFile.type.startsWith('video/')) {
        setMediaType('video');
      } else if (selectedFile.type.startsWith('image/')) {
        setMediaType('image');
      }
    }
  };

  return (
    <div className="glass-card p-8 animate-scale-in">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <PlusIcon className="w-5 h-5 text-orange-400" />
        Save New Bookmark
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* URL Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Link URL</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-orange-400" />
            </div>
            <input
              type="url"
              required
              className="input-glass pl-12 pr-4 py-3.5 text-base"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Detected Platform Display */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Detected Platform</label>
            <div className="input-glass py-3.5 px-4 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-orange-400" />
              <span className="text-slate-200 font-medium">{getPlatformDisplayName(platform)}</span>
              {platform !== 'web' && (
                <span className="ml-auto badge text-[9px] px-2 py-1">Auto-detected</span>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Add Media (AI Analysis)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer flex items-center justify-center px-4 py-3.5 border-2 border-dashed rounded-xl transition-all duration-200 ${file
                ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                : 'border-white/20 hover:border-orange-500/50 text-slate-400 hover:bg-white/5'
                }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
              {file ? (
                <span className="truncate text-sm font-medium">{file.name}</span>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <PhotoIcon className="w-5 h-5" />
                  <span className="text-slate-500">/</span>
                  <VideoCameraIcon className="w-5 h-5" />
                  <span>Upload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing with Gemini...
            </>
          ) : (
            'Add to Library'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBookmark;
