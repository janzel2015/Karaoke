// KAPTEN KARAOKE - Lyrics Parser Hook
import { useState, useCallback, useRef } from 'react';
import type { LyricLine } from '@/types';

// Parse LRC format lyrics
function parseLRC(lrcContent: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
  // const enhancedRegex = /\<(\d{2}):(\d{2})\.(\d{2,3})\>/g;

  const lrcLines = lrcContent.split('\n');

  for (const line of lrcLines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = match[4].trim();

      if (text) {
        lines.push({ time, text });
      }
    }
  }

  // Sort by time
  return lines.sort((a, b) => a.time - b.time);
}

// Parse JSON format lyrics
function parseJSONLyrics(jsonContent: string): LyricLine[] {
  try {
    const parsed = JSON.parse(jsonContent);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        time: typeof item.time === 'number' ? item.time : parseFloat(item.time),
        text: item.text || item.lyric || '',
      })).sort((a, b) => a.time - b.time);
    }
  } catch {
    // Not valid JSON, return empty
  }
  return [];
}

export function useLyrics() {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Load lyrics from URL
  const loadLyrics = useCallback(async (lyricsUrl: string) => {
    if (!lyricsUrl) {
      setLyrics([]);
      setCurrentLineIndex(-1);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(lyricsUrl);
      if (!response.ok) throw new Error('Failed to load lyrics');
      
      const content = await response.text();
      
      // Try LRC format first
      let parsed = parseLRC(content);
      
      // If empty, try JSON format
      if (parsed.length === 0) {
        parsed = parseJSONLyrics(content);
      }

      setLyrics(parsed);
      setCurrentLineIndex(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLyrics([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update current line based on playback time
  const updateCurrentTime = useCallback((currentTime: number) => {
    if (lyrics.length === 0) return;

    // Find the current line
    let newIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) {
        newIndex = i;
      } else {
        break;
      }
    }

    setCurrentLineIndex(newIndex);

    // Auto-scroll to current line
    if (lyricsContainerRef.current && newIndex >= 0) {
      const lineElements = lyricsContainerRef.current.querySelectorAll('.lyric-line');
      const currentElement = lineElements[newIndex] as HTMLElement;
      
      if (currentElement) {
        const container = lyricsContainerRef.current;
        const containerHeight = container.clientHeight;
        const elementTop = currentElement.offsetTop;
        const elementHeight = currentElement.clientHeight;
        
        container.scrollTo({
          top: elementTop - containerHeight / 2 + elementHeight / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [lyrics]);

  // Clear lyrics
  const clearLyrics = useCallback(() => {
    setLyrics([]);
    setCurrentLineIndex(-1);
    setError(null);
  }, []);

  // Get current and upcoming lines for display
  const getVisibleLyrics = useCallback((contextLines: number = 3) => {
    if (currentLineIndex < 0) {
      return lyrics.slice(0, contextLines * 2 + 1);
    }

    const start = Math.max(0, currentLineIndex - contextLines);
    const end = Math.min(lyrics.length, currentLineIndex + contextLines + 1);
    
    return lyrics.slice(start, end);
  }, [lyrics, currentLineIndex]);

  return {
    lyrics,
    currentLineIndex,
    isLoading,
    error,
    lyricsContainerRef,
    loadLyrics,
    updateCurrentTime,
    clearLyrics,
    getVisibleLyrics,
  };
}
