<script lang="ts">
  import Avatar from '../assets/avatar.png';
  import { store } from './store/store.svelte';

  const isPlaying = $derived(store.status === 'playing');

  const togglePlayPause = () => {
    if (store.status === 'playing') {
      store.pause();
    } else {
      store.play();
    }
  };
</script>

<section
  class="absolute flex flex-col items-center justify-center w-full h-full"
>
  <img
    id="podcast-cover"
    class="object-cover object-center rounded-full h-60 w-60 md:w-[calc(100vw/3)] md:h-[calc(100vw/3)] {isPlaying
      ? 'animate-spin drop-shadow-glow'
      : ''}"
    src={Avatar}
    alt="podcast cover"
    onclick={togglePlayPause}
    role="button"
    title=""
  />
</section>
