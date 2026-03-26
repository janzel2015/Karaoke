// KAPTEN KARAOKE - Karaoke Mode Component
import { useEffect, useRef } from 'react';
import { X, Mic2 } from 'lucide-react';
import type { Song, LyricLine } from '@/types';

interface KaraokeModeProps {
  song: Song;
  lyrics: LyricLine[];
  currentLineIndex: number;
  currentTime: number;
  isPlaying: boolean;
  onClose: () => void;
}

export function KaraokeMode({
  song,
  lyrics,
  currentLineIndex,
  // currentTime,
  isPlaying,
  onClose,
}: KaraokeModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current line
  useEffect(() => {
    if (currentLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = currentLineRef.current;
      
      const containerHeight = container.clientHeight;
      const elementTop = element.offsetTop;
      const elementHeight = element.clientHeight;
      
      container.scrollTo({
        top: elementTop - containerHeight / 2 + elementHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [currentLineIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (lyrics.length === 0) {
    return (
      <div className="fixed inset-0 z-50 karaoke-overlay flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <Mic2 className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Lyrics Available</h2>
        <p className="text-gray-400">This song doesn&apos;t have synchronized lyrics.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 karaoke-overlay flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-top">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              src={song.coverUrl}
              alt={song.title}
              className={`w-full h-full object-cover ${isPlaying ? 'album-spin' : ''}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg';
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Lyrics Display */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto space-y-6 py-[40vh]">
          {lyrics.map((line, index) => {
            const isActive = index === currentLineIndex;
            const isPassed = index < currentLineIndex;
            const isUpcoming = index > currentLineIndex;

            return (
              <div
                key={index}
                ref={isActive ? currentLineRef : null}
                className={`
                  lyric-line text-center transition-all duration-500
                  ${isActive ? 'active text-3xl md:text-5xl font-bold' : ''}
                  ${isPassed ? 'passed text-xl md:text-2xl' : ''}
                  ${isUpcoming ? 'text-xl md:text-2xl' : ''}
                `}
                style={{
                  opacity: isActive ? 1 : isPassed ? 0.5 : 0.3,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
