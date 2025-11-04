declare module 'react-player' {
  import type { Component } from 'react';

  interface ReactPlayerProps {
    url?: string | string[] | null;
    playing?: boolean;
    volume?: number;
    muted?: boolean;
    onReady?: () => void;
    onProgress?: (state: { playedSeconds: number }) => void;
    onEnded?: () => void;
    onError?: () => void;
    config?: {
      youtube?: {
        playerVars?: Record<string, unknown>;
      };
    };
  }

  interface ReactPlayerInstance {
    getInternalPlayer(): {
      playVideo?: () => void;
      pauseVideo?: () => void;
      setVolume?: (volume: number) => void;
      getCurrentTime?: () => number;
      seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
    } | null;
    getDuration(): number | null;
    getCurrentTime(): number | null;
    seekTo(seconds: number, type?: 'seconds'): void;
    load(): void;
  }

  class ReactPlayer extends Component<ReactPlayerProps> {
    getInternalPlayer(): {
      playVideo?: () => void;
      pauseVideo?: () => void;
      setVolume?: (volume: number) => void;
      getCurrentTime?: () => number;
      seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
    } | null;
    getDuration(): number | null;
    getCurrentTime(): number | null;
    seekTo(seconds: number, type?: 'seconds'): void;
    load(): void;
  }

  export default ReactPlayer;
}

