// KAPTEN KARAOKE - GitHub RAW Media Loader Hook
import { useState, useCallback, useEffect } from 'react';
import type { Song, Playlist } from '@/types';

// Default GitHub repository configuration
// Users can customize this or provide their own
const DEFAULT_GITHUB_SOURCE = {
  owner: 'kaptenkaraoke',
  repo: 'media',
  branch: 'main',
  basePath: '',
};

// Generate RAW GitHub URL
export function generateRawUrl(
  owner: string,
  repo: string,
  branch: string,
  path: string
): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

// Sample/demo songs for initial setup
export const SAMPLE_SONGS: Song[] = [
  {
    id: 'demo-1',
    title: 'Sample Song 1',
    artist: 'Demo Artist',
    album: 'Demo Album',
    duration: 180,
    coverUrl: 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg',
    audioUrl: 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/songs/demo1.mp3',
    minusOneUrl: 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/songs/demo1-minus.mp3',
    videoUrl: 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/videos/demo1.mp4',
    lyricsUrl: 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/lyrics/demo1.lrc',
    genre: 'Pop',
    year: 2024,
  },
];

// Parse song from GitHub file structure
function parseSongFromFiles(
  files: { name: string; path: string; download_url: string }[],
  githubSource: { owner: string; repo: string; branch: string }
): Song[] {
  const songs: Map<string, Partial<Song>> = new Map();

  // Group files by song name
  for (const file of files) {
    const name = file.name.toLowerCase();
    const url = file.download_url;

    // Extract base name (remove extension)
    let baseName = name.replace(/\.(mp3|mp4|lrc|jpg|jpeg|png|webp)$/i, '');
    
    // Remove '-minus' suffix for grouping
    const isMinusOne = baseName.endsWith('-minus');
    if (isMinusOne) {
      baseName = baseName.replace(/-minus$/, '');
    }

    if (!songs.has(baseName)) {
      songs.set(baseName, {
        id: baseName,
        title: baseName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        artist: 'Unknown Artist',
        duration: 0,
      });
    }

    const song = songs.get(baseName)!;

    if (name.endsWith('.mp3')) {
      if (isMinusOne) {
        song.minusOneUrl = url;
      } else {
        song.audioUrl = url;
      }
    } else if (name.endsWith('.mp4')) {
      song.videoUrl = url;
    } else if (name.endsWith('.lrc') || name.endsWith('.json')) {
      song.lyricsUrl = url;
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(name)) {
      song.coverUrl = url;
    }
  }

  // Filter only songs with audio files and convert to array
  return Array.from(songs.values())
    .filter((song): song is Song => !!song.audioUrl)
    .map((song, index) => ({
      ...song,
      id: song.id || `song-${index}`,
      coverUrl: song.coverUrl || `https://raw.githubusercontent.com/${githubSource.owner}/${githubSource.repo}/${githubSource.branch}/images/default-cover.jpg`,
    } as Song));
}

export function useGitHubLoader(
  customSource?: { owner: string; repo: string; branch: string; path?: string }
) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubSource, setGithubSource] = useState({
    ...DEFAULT_GITHUB_SOURCE,
    ...customSource,
  });

  // Fetch repository contents from GitHub API
  const fetchRepoContents = useCallback(async (
    repoPath: string = ''
  ): Promise<{ name: string; path: string; download_url: string; type: string }[]> => {
    const apiUrl = `https://api.github.com/repos/${githubSource.owner}/${githubSource.repo}/contents/${repoPath}?ref=${githubSource.branch}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }, [githubSource]);

  // Load all songs from GitHub repository
  const loadSongsFromGitHub = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allFiles: { name: string; path: string; download_url: string }[] = [];

      // Try to fetch from different folders
      const folders = ['songs', 'audio', 'music', ''];
      
      for (const folder of folders) {
        try {
          const contents = await fetchRepoContents(folder);
          const files = contents.filter(item => item.type === 'file');
          allFiles.push(...files);
        } catch {
          // Folder might not exist, continue
        }
      }

      if (allFiles.length === 0) {
        // Use sample songs if no files found
        setSongs(SAMPLE_SONGS);
        setError('No songs found in repository. Using demo songs.');
        return;
      }

      const parsedSongs = parseSongFromFiles(allFiles, githubSource);
      
      if (parsedSongs.length === 0) {
        setSongs(SAMPLE_SONGS);
        setError('No valid songs found. Using demo songs.');
        return;
      }

      setSongs(parsedSongs);
    } catch (err) {
      console.error('Error loading from GitHub:', err);
      setSongs(SAMPLE_SONGS);
      setError(err instanceof Error ? err.message : 'Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  }, [fetchRepoContents, githubSource]);

  // Load playlists from JSON file
  const loadPlaylistsFromGitHub = useCallback(async () => {
    try {
      const playlistFiles = ['playlists.json', 'index.json', 'songs.json'];
      
      for (const file of playlistFiles) {
        try {
          const url = generateRawUrl(
            githubSource.owner,
            githubSource.repo,
            githubSource.branch,
            file
          );
          
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            
            if (data.playlists) {
              setPlaylists(data.playlists);
            } else if (Array.isArray(data)) {
              // If it's an array of songs, create a default playlist
              setPlaylists([{
                id: 'default',
                name: 'All Songs',
                description: 'All available songs',
                songs: data,
              }]);
            }
            return;
          }
        } catch {
          // Try next file
        }
      }

      // Create default playlist from loaded songs
      if (songs.length > 0) {
        setPlaylists([{
          id: 'all-songs',
          name: 'All Songs',
          description: 'All available songs from repository',
          coverUrl: songs[0]?.coverUrl,
          songs: songs,
        }]);
      }
    } catch (err) {
      console.error('Error loading playlists:', err);
    }
  }, [githubSource, songs]);

  // Update GitHub source
  const updateGitHubSource = useCallback((source: Partial<typeof githubSource>) => {
    setGithubSource(prev => ({ ...prev, ...source }));
  }, []);

  // Load songs on mount
  useEffect(() => {
    loadSongsFromGitHub();
  }, [loadSongsFromGitHub]);

  // Load playlists when songs change
  useEffect(() => {
    if (songs.length > 0) {
      loadPlaylistsFromGitHub();
    }
  }, [songs.length, loadPlaylistsFromGitHub]);

  return {
    songs,
    playlists,
    isLoading,
    error,
    githubSource,
    loadSongsFromGitHub,
    loadPlaylistsFromGitHub,
    updateGitHubSource,
    generateRawUrl: (path: string) => generateRawUrl(
      githubSource.owner,
      githubSource.repo,
      githubSource.branch,
      path
    ),
  };
}
