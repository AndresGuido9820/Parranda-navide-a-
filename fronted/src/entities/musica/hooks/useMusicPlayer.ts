/// <reference types="../../../types/youtube-iframe" />
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Song } from '../types/song.types';

interface QueueItem {
  song: Song;
  isPlayed: boolean;
}

interface UseMusicPlayerOptions {
  initialSong?: Song;
  onSongEnd?: () => void;
}

export interface UseMusicPlayerReturn {
  queue: QueueItem[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  next: () => void;
  previous: () => void;
  // Para el iframe de YouTube
  playerRef: React.MutableRefObject<any>;
  containerId: string;
  currentVideoId: string | null;
}

/**
 * Extrae el video ID de una URL de YouTube o de un formato youtube:ID
 */
const extractVideoId = (audioUrl: string): string | null => {
  if (audioUrl.startsWith('youtube:')) {
    return audioUrl.replace('youtube:', '');
  }
  
  // Extraer de URLs como https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = audioUrl.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }
  
  // Extraer de URLs como https://youtu.be/VIDEO_ID
  const youtuBeMatch = audioUrl.match(/youtu\.be\/([^?&]+)/);
  if (youtuBeMatch) {
    return youtuBeMatch[1];
  }
  
  // Si ya es un ID directo (sin prefijo)
  if (/^[a-zA-Z0-9_-]{11}$/.test(audioUrl)) {
    return audioUrl;
  }
  
  return null;
};

/**
 * Custom hook para manejar la reproducción de música usando YouTube IFrame API
 */
export const useMusicPlayer = (
  options: UseMusicPlayerOptions = {}
): UseMusicPlayerReturn => {
  const { initialSong, onSongEnd } = options;

  const playerRef = useRef<any>(null);
  const containerIdRef = useRef(`youtube-player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [queue, setQueue] = useState<QueueItem[]>(
    initialSong ? [{ song: initialSong, isPlayed: false }] : []
  );
  const [currentIndex, setCurrentIndexState] = useState<number>(initialSong ? 0 : -1);
  
  // Wrapper para setCurrentIndex que actualiza isPlayed
  const setCurrentIndex = useCallback((newIndex: number) => {
    console.log('[useMusicPlayer] setCurrentIndex - Cambiando a índice:', newIndex);
    
    setQueue((prevQueue) => {
      const newQueue = prevQueue.map((item, index) => {
        // Si el índice es menor al nuevo índice, marcar como reproducida
        if (index < newIndex) {
          return { ...item, isPlayed: true };
        }
        // Si es el nuevo índice actual, no marcarlo como reproducida (puede ser que se retroceda)
        if (index === newIndex) {
          return { ...item, isPlayed: false };
        }
        // Si es mayor, mantener el estado actual
        return item;
      });
      
      return newQueue;
    });
    
    setCurrentIndexState(newIndex);
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);

  // Canción actual derivada del índice
  const currentSong = currentIndex >= 0 && currentIndex < queue.length 
    ? queue[currentIndex].song 
    : null;

  // Video ID actual
  const currentVideoId = currentSong ? extractVideoId(currentSong.audioUrl) : null;

  // Cargar la API de YouTube IFrame
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      console.log('[useMusicPlayer] API ya cargada');
      setIsApiReady(true);
      return;
    }

    // Verificar si ya hay un script cargándose
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existingScript) {
      // Esperar a que se cargue
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setIsApiReady(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Cargar el script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    
    script.onload = () => {
      console.log('[useMusicPlayer] Script de YouTube IFrame API cargado');
    };

    script.onerror = () => {
      console.error('[useMusicPlayer] Error al cargar el script de YouTube IFrame API');
    };

    document.body.appendChild(script);

    // Configurar callback global
    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      console.log('[useMusicPlayer] API de YouTube lista');
      setIsApiReady(true);
      if (originalCallback) {
        originalCallback();
      }
    };

    return () => {
      // No limpiar el script globalmente, puede ser usado por otros componentes
    };
  }, []);

  // Crear/destruir player cuando cambia el videoId
  useEffect(() => {
    if (!isApiReady) {
      console.log('[useMusicPlayer] API no lista aún');
      return;
    }

    if (!currentVideoId) {
      console.log('[useMusicPlayer] No hay videoId, destruyendo player si existe');
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          console.error('[useMusicPlayer] Error al destruir player:', error);
        }
      }
      setIsLoading(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    console.log('[useMusicPlayer] Creando/destruyendo player para videoId:', currentVideoId);

    // Función para crear el player
    const createPlayer = async () => {
      // Si ya existe un player, siempre destruirlo primero para asegurar recreación limpia
      if (playerRef.current) {
        try {
          console.log('[useMusicPlayer] Destruyendo player anterior para recrear');
          playerRef.current.destroy();
          playerRef.current = null;
          // Esperar un momento para que el destroy se complete
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error('[useMusicPlayer] Error al destruir player anterior:', error);
          playerRef.current = null;
        }
      }

      const cont = document.getElementById(containerIdRef.current);
      if (!cont) {
        console.error('[useMusicPlayer] Contenedor no encontrado');
        return;
      }

      // Limpiar el contenedor si tiene contenido previo
      cont.innerHTML = '';

      console.log('[useMusicPlayer] Creando player con videoId:', currentVideoId);
      setIsLoading(true);
      setIsPlaying(false);
      setCurrentTime(0);

      try {
        playerRef.current = new window.YT.Player(containerIdRef.current, {
          videoId: currentVideoId || undefined,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            iv_load_policy: 3,
            fs: 0,
          },
          events: {
            onReady: (event) => {
              console.log('[useMusicPlayer] ✅ Player listo');
              setIsLoading(false);
              
              if (event.target) {
                const dur = event.target.getDuration();
                console.log('[useMusicPlayer] Duración:', dur);
                if (dur && dur > 0) {
                  setDuration(dur);
                }
              }
            },
            onStateChange: (event) => {
              const state = event.data;
              console.log('[useMusicPlayer] Estado cambió:', state);
              
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsLoading(false);
              } else if (state === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (state === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                handleEnded();
              } else if (state === window.YT.PlayerState.BUFFERING) {
                setIsLoading(true);
              }
            },
            onError: (event) => {
              console.error('[useMusicPlayer] Error en player:', event.data);
              setIsLoading(false);
              setIsPlaying(false);
            },
          },
        });
      } catch (error) {
        console.error('[useMusicPlayer] Error al crear player:', error);
        setIsLoading(false);
      }
    };

    // Esperar a que el contenedor exista
    const container = document.getElementById(containerIdRef.current);
    if (!container) {
      console.log('[useMusicPlayer] Contenedor no existe aún, esperando...');
      const checkInterval = setInterval(() => {
        const cont = document.getElementById(containerIdRef.current);
        if (cont) {
          clearInterval(checkInterval);
          createPlayer();
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    createPlayer();

    return () => {
      if (playerRef.current) {
        try {
          console.log('[useMusicPlayer] Limpiando player');
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          console.error('[useMusicPlayer] Error al limpiar player:', error);
        }
      }
    };
  }, [isApiReady, currentVideoId]);

  // Actualizar tiempo cada segundo cuando está reproduciendo
  useEffect(() => {
    if (!isPlaying || !playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time);
        } catch (error) {
          console.error('[useMusicPlayer] Error al obtener tiempo:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Actualizar volumen cuando cambia
  useEffect(() => {
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(isMuted ? 0 : volume * 100);
      } catch (error) {
        console.error('[useMusicPlayer] Error al actualizar volumen:', error);
      }
    }
  }, [volume, isMuted]);

  // Siguiente canción
  const next = useCallback(() => {
    if (queue.length === 0) return;
    
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      // setCurrentIndex ya maneja isPlayed automáticamente
      setCurrentIndex(nextIndex);
    } else {
      // No hay más canciones
      setCurrentIndexState(-1);
      setIsPlaying(false);
    }
  }, [currentIndex, queue.length, setCurrentIndex]);

  // Canción anterior
  const previous = useCallback(() => {
    if (queue.length === 0 || currentIndex <= 0) return;
    
    const prevIndex = currentIndex - 1;
    // setCurrentIndex ya maneja isPlayed automáticamente (marca la anterior como no reproducida)
    setCurrentIndex(prevIndex);
  }, [currentIndex, setCurrentIndex]);

  // Agregar a la cola
  const addToQueue = useCallback((song: Song) => {
    console.log('[useMusicPlayer] addToQueue - Agregando canción:', song);
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue, { song, isPlayed: false }];
      
      // Si la cola estaba vacía, establecer el índice a 0
      if (prevQueue.length === 0 && currentIndex === -1) {
        console.log('[useMusicPlayer] addToQueue - Cola vacía, estableciendo índice a 0');
        setCurrentIndexState(0);
      }
      
      return newQueue;
    });
  }, [currentIndex]);

  // Eliminar de la cola
  const removeFromQueue = useCallback((songId: string) => {
    setQueue((prevQueue) => {
      const removedIndex = prevQueue.findIndex((item) => item.song.id === songId);
      
      if (removedIndex === -1) return prevQueue;
      
      const newQueue = prevQueue.filter((item) => item.song.id !== songId);
      
      if (removedIndex === currentIndex) {
        // Si se eliminó la canción actual
        if (newQueue.length === 0) {
          setCurrentIndexState(-1);
          setIsPlaying(false);
        } else {
          const newIndex = removedIndex >= newQueue.length 
            ? newQueue.length - 1 
            : removedIndex;
          // Actualizar el índice después de que la cola se actualice
          setTimeout(() => setCurrentIndex(newIndex), 0);
        }
      } else if (removedIndex < currentIndex) {
        // Actualizar el índice después de que la cola se actualice
        setTimeout(() => setCurrentIndex(currentIndex - 1), 0);
      }
      
      return newQueue;
    });
  }, [currentIndex]);

  // Reordenar la cola
  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      const [movedItem] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedItem);
      
      let newCurrentIndex = currentIndex;
      
      if (currentIndex === fromIndex) {
        newCurrentIndex = toIndex;
      } else if (fromIndex < currentIndex && currentIndex <= toIndex) {
        newCurrentIndex = currentIndex - 1;
      } else if (fromIndex > currentIndex && currentIndex >= toIndex) {
        newCurrentIndex = currentIndex + 1;
      }
      
      if (newCurrentIndex !== currentIndex) {
        setCurrentIndex(newCurrentIndex);
      }
      
      return newQueue;
    });
  }, [currentIndex]);

  // Reproducir
  const play = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < queue.length && currentSong) {
      if (isPlaying) {
        return;
      }
      resume();
    }
  }, [currentIndex, queue.length, currentSong, isPlaying]);

  // Reanudar
  const resume = useCallback(() => {
    console.log('[useMusicPlayer] resume - Llamado');
    if (playerRef.current && !isPlaying && currentSong) {
      console.log('[useMusicPlayer] resume - Reproduciendo');
      try {
        playerRef.current.playVideo();
      } catch (error) {
        console.error('[useMusicPlayer] resume - Error:', error);
      }
    }
  }, [isPlaying, currentSong]);

  // Pausar
  const pause = useCallback(() => {
    console.log('[useMusicPlayer] pause - Llamado');
    if (playerRef.current && isPlaying) {
      console.log('[useMusicPlayer] pause - Pausando');
      try {
        playerRef.current.pauseVideo();
      } catch (error) {
        console.error('[useMusicPlayer] pause - Error:', error);
      }
    }
  }, [isPlaying]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    console.log('[useMusicPlayer] togglePlayPause - Llamado');
    if (isPlaying) {
      pause();
    } else {
      if (currentSong) {
        resume();
      } else if (queue.length > 0) {
        setCurrentIndex(0);
      }
    }
  }, [isPlaying, currentSong, queue.length, pause, resume]);

  // Seek
  const seek = useCallback((time: number) => {
    console.log('[useMusicPlayer] seek - Llamado con tiempo:', time);
    if (playerRef.current) {
      try {
        playerRef.current.seekTo(time, true);
        setCurrentTime(time);
      } catch (error) {
        console.error('[useMusicPlayer] seek - Error:', error);
      }
    }
  }, []);

  // Establecer volumen
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Manejar fin de canción
  const handleEnded = useCallback(() => {
    console.log('[useMusicPlayer] handleEnded - Canción terminada');
    setCurrentTime(0);
    
    if (onSongEnd) {
      onSongEnd();
    }
    
    next();
  }, [onSongEnd, next]);

  return {
    queue,
    currentIndex,
    setCurrentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    play,
    pause,
    resume,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    next,
    previous,
    playerRef,
    containerId: containerIdRef.current,
    currentVideoId,
  };
};
