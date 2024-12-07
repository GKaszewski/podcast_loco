import type { Podcast } from '../types';

export const SEEK_STEP = 15;

class GlobalState {
  audioElement = $state<HTMLAudioElement | null>(null);
  podcasts = $state<Podcast[]>([]);
  currentPodcast = $state<Podcast | null>(null);
  isOverlayVisible = $state<boolean>(false);
  currentTimestamp = $state<number | null>(null);
  endTimestamp = $state<number | null>(null);
  view = $state<'home' | 'podcast-detail'>('home');
  status = $state<'playing' | 'paused' | 'stopped'>('stopped');
  audioSource = $state<MediaElementAudioSourceNode | null>(null);
  audioContext = $state<AudioContext>();
  

  play() {
    const audioContext = this.audioContext;
    const audio = this.audioElement;
    if (!audio || !audioContext) return;

    this.endTimestamp = audio.duration;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    audio.play();
    this.status = 'playing';
  }

  pause() {
    const audio = this.audioElement;
    const audioContext = this.audioContext;
    if (!audio || !audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    audio.pause();
    this.status = 'paused';
  }

  reset() {
    this.currentPodcast = null;
    this.currentTimestamp = null;
    this.endTimestamp = null;
    this.status = 'stopped';
  }

  togglePlayback() {
    if (this.status === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  seekForward(seconds: number) {
    const audio = this.audioElement;
    if (!audio) return;

    audio.currentTime += seconds;
  }

  seekBackward(seconds: number) {
    const audio = this.audioElement;
    if (!audio) return;

    audio.currentTime -= seconds;
  }
}

export const store = new GlobalState();
