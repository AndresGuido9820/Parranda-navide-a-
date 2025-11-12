// Declaración de tipos para YouTube IFrame API

declare namespace YT {
  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    clearVideo(): void;
    getVideoData(): {
      video_id: string;
      title: string;
      author: string;
    };
    getVideoEmbedCode(): string;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoCurrentTime(): number;
    getCurrentTime(): number;
    setVolume(volume: number): void;
    getVolume(): number;
    setMuted(mute: boolean): void;
    isMuted(): boolean;
    getPlayerState(): number;
    getAvailablePlaybackRates(): number[];
    setPlaybackRate(suggestedRate: number): void;
    getPlaybackRate(): number;
    getAvailableQualityLevels(): string[];
    getPlaybackQuality(): string;
    setPlaybackQuality(suggestedQuality: string): void;
    destroy(): void;
  }

  interface PlayerConstructor {
    new (
      elementId: string,
      config: {
        videoId?: string;
        playerVars?: {
          autoplay?: number;
          controls?: number;
          rel?: number;
          modestbranding?: number;
          playsinline?: number;
          enablejsapi?: number;
          origin?: string;
          iv_load_policy?: number;
          fs?: number;
        };
        events?: {
          onReady?: (event: { target: YT.Player }) => void;
          onStateChange?: (event: { data: number; target: YT.Player }) => void;
          onError?: (event: { data: number; target: YT.Player }) => void;
        };
      }
    ): YT.Player;

    PlayerState: {
      UNSTARTED: -1;
      ENDED: 0;
      PLAYING: 1;
      PAUSED: 2;
      BUFFERING: 3;
      CUED: 5;
    };
  }
}

declare global {
  interface Window {
    YT: {
      Player: YT.PlayerConstructor;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};

