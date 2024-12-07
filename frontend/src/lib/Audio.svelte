<script lang="ts">
  import { onMount } from 'svelte';
  import { store } from './store/store.svelte';

  const srcUrl = $derived(store.currentPodcast?.url);

  onMount(() => {
    const audioContext = store.audioContext;
    const src = store.audioSource;

    if (!audioContext) {
      console.log('Audio context is not available, creating a new one');
      store.audioContext = new AudioContext();
    }

    if (!src) {
      console.log('Audio source is not available, creating a new one');
      const audioContext = store.audioContext;
      if (!audioContext) return;
      const audioElement = document.getElementById('audio') as HTMLAudioElement;
      store.audioSource = audioContext.createMediaElementSource(audioElement);
      store.audioSource.connect(audioContext.destination);
    }
  });

  const onLoadedMetadata = (event: Event) => {
    const audio = event.target as HTMLAudioElement;
    store.endTimestamp = audio.duration;
    store.currentTimestamp = audio.currentTime;
    store.play();
  };

  const onEnded = (event: Event) => {
    store.reset();
  };

  const onTimeUpdate = (event: Event) => {
    const audio = event.target as HTMLAudioElement;
    store.currentTimestamp = audio.currentTime;
  };
</script>

<audio
  bind:this={store.audioElement}
  id="audio"
  class="hidden"
  onloadedmetadata={onLoadedMetadata}
  onended={onEnded}
  ontimeupdate={onTimeUpdate}
  src={srcUrl}
  crossorigin="anonymous"
></audio>
