// KAPTEN KARAOKE - Audio Player Hook
import { useRef, useState, useCallback, useEffect } from 'react';
import type { Song, PlayerState, QueueState } from '@/types';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const stereoPannerRef = useRef<StereoPannerNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    playbackRate: 1,
    isMinusOne: false,
    isKaraokeMode: false,
    isVideoMode: false,
    repeatMode: 'none',
    isShuffled: false,
  });

  const [queue, setQueue] = useState<QueueState>({
    songs: [],
    currentIndex: -1,
    originalOrder: [],
  });

  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Initialize Web Audio API for minus one effect
  const initAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const gainNode = audioContext.createGain();
      const stereoPanner = audioContext.createStereoPanner();
      const filterNode = audioContext.createBiquadFilter();
      const analyser = audioContext.createAnalyser();

      // Configure filter for vocal reduction (bandpass around vocal frequencies)
      filterNode.type = 'notch';
      filterNode.frequency.value = 1000;
      filterNode.Q.value = 1;

      // Configure analyser for visualizer
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      // Connect nodes: source -> filter -> stereoPanner -> gain -> analyser -> destination
      source.connect(filterNode);
      filterNode.connect(stereoPanner);
      stereoPanner.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      sourceNodeRef.current = source;
      gainNodeRef.current = gainNode;
      stereoPannerRef.current = stereoPanner;
      filterNodeRef.current = filterNode;
      analyserRef.current = analyser;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }, []);

  // Toggle minus one (vocal reduction)
  const toggleMinusOne = useCallback(() => {
    if (!stereoPannerRef.current || !filterNodeRef.current) {
      initAudioContext();
    }

    setPlayerState(prev => {
      const newIsMinusOne = !prev.isMinusOne;
      
      if (stereoPannerRef.current) {
        // Simulate vocal reduction by narrowing stereo field
        stereoPannerRef.current.pan.value = newIsMinusOne ? 0.3 : 0;
      }
      
      if (filterNodeRef.current) {
        // Apply notch filter to reduce vocal frequencies (typically 1-4kHz)
        filterNodeRef.current.frequency.value = newIsMinusOne ? 2500 : 1000;
        filterNodeRef.current.gain.value = newIsMinusOne ? -15 : 0;
      }

      return { ...prev, isMinusOne: newIsMinusOne };
    });
  }, [initAudioContext]);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (playerState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
      initAudioContext();
    }
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [playerState.isPlaying, initAudioContext]);

  // Play specific song
  const playSong = useCallback((song: Song, songQueue?: Song[], startIndex?: number) => {
    if (!audioRef.current) return;

    // Update queue if provided
    if (songQueue && songQueue.length > 0) {
      setQueue({
        songs: songQueue,
        currentIndex: startIndex ?? songQueue.findIndex(s => s.id === song.id),
        originalOrder: songQueue,
      });
    }

    setCurrentSong(song);
    audioRef.current.src = playerState.isMinusOne && song.minusOneUrl 
      ? song.minusOneUrl 
      : song.audioUrl;
    audioRef.current.playbackRate = playerState.playbackRate;
    
    audioRef.current.play().catch(console.error);
    setPlayerState(prev => ({ ...prev, isPlaying: true }));
    initAudioContext();
  }, [playerState.isMinusOne, playerState.playbackRate, initAudioContext]);

  // Seek to time
  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setPlayerState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const newMuted = !playerState.isMuted;
    audioRef.current.muted = newMuted;
    setPlayerState(prev => ({ ...prev, isMuted: newMuted }));
  }, [playerState.isMuted]);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlayerState(prev => ({ ...prev, playbackRate: rate }));
  }, []);

  // Toggle karaoke mode
  const toggleKaraokeMode = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isKaraokeMode: !prev.isKaraokeMode }));
  }, []);

  // Toggle video mode
  const toggleVideoMode = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isVideoMode: !prev.isVideoMode }));
  }, []);

  // Toggle repeat mode
  const toggleRepeatMode = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' ? 'all' : prev.repeatMode === 'all' ? 'one' : 'none',
    }));
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setQueue(prev => {
      if (!prev.isShuffled) {
        // Shuffle
        const shuffled = [...prev.songs].sort(() => Math.random() - 0.5);
        return { ...prev, songs: shuffled, isShuffled: true };
      } else {
        // Restore original order
        return { ...prev, songs: [...prev.originalOrder], isShuffled: false };
      }
    });
    setPlayerState(prev => ({ ...prev, isShuffled: !prev.isShuffled }));
  }, []);

  // Next song
  const nextSong = useCallback(() => {
    if (queue.songs.length === 0) return;
    
    let nextIndex = queue.currentIndex + 1;
    if (nextIndex >= queue.songs.length) {
      nextIndex = playerState.repeatMode === 'all' ? 0 : queue.currentIndex;
    }
    
    const next = queue.songs[nextIndex];
    if (next) {
      playSong(next, queue.songs, nextIndex);
    }
  }, [queue, playerState.repeatMode, playSong]);

  // Previous song
  const prevSong = useCallback(() => {
    if (queue.songs.length === 0) return;
    
    let prevIndex = queue.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playerState.repeatMode === 'all' ? queue.songs.length - 1 : 0;
    }
    
    const prev = queue.songs[prevIndex];
    if (prev) {
      playSong(prev, queue.songs, prevIndex);
    }
  }, [queue, playerState.repeatMode, playSong]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      if (playerState.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        nextSong();
      }
    };

    const handlePlay = () => setPlayerState(prev => ({ ...prev, isPlaying: true }));
    const handlePause = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [playerState.repeatMode, nextSong]);

  // Get analyzer data for visualizer
  const getAnalyzerData = useCallback(() => {
    if (!analyserRef.current) return null;
    
    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    const timeData = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    analyserRef.current.getByteFrequencyData(frequencyData);
    analyserRef.current.getByteTimeDomainData(timeData);
    
    return { frequencyData, timeData };
  }, []);

  return {
    audioRef,
    analyserRef,
    playerState,
    queue,
    currentSong,
    togglePlay,
    playSong,
    seekTo,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleMinusOne,
    toggleKaraokeMode,
    toggleVideoMode,
    toggleRepeatMode,
    toggleShuffle,
    nextSong,
    prevSong,
    getAnalyzerData,
  };
}
