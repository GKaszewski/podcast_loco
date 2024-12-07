<script lang="ts">
  import FastForward from './icons/FastForward.svelte';
  import Pause from './icons/Pause.svelte';
  import Play from './icons/Play.svelte';
  import Rewind from './icons/Rewind.svelte';
  import { SEEK_STEP, store } from './store/store.svelte';

  let formattedCurrentTimestamp = $state();
  let formattedEndTimestamp = $state();

  const onPlayPauseClick = () => {
    if (store.status === 'playing') {
      store.pause();
    } else {
      store.play();
    }
  };

  const onFastForward = () => {
    store.seekForward(SEEK_STEP);
  };

  const onRewind = () => {
    store.seekBackward(SEEK_STEP);
  };

  const onSeek = (event: Event) => {
    const audio = store.audioElement;
    if (!audio) return;

    const target = event.target as HTMLInputElement;
    audio.currentTime = Number(target.value);
  };

  const prettyTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    if (isNaN(minutes) || isNaN(seconds) || time === 0) return '--:--';

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  $effect(() => {
    formattedCurrentTimestamp = prettyTime(store.currentTimestamp || 0);
    formattedEndTimestamp = prettyTime(store.endTimestamp || 0);
  });
</script>

<footer
  id="audio-play-bar"
  class="flex flex-col md:flex-row items-center justify-around w-full gap-2 p-4 pt-8 bg-slate-900/40 ring-1 ring-indigo-600/60 backdrop-blur-2xl isolate z-20"
>
  <span class="text-white cursor-default min-w-52"
    >{store.currentPodcast?.title}</span
  >
  <div>
    <button
      class="p-2 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
      onclick={onRewind}
      disabled={store.status === 'stopped'}
      title="Rewind"
    >
      <Rewind class="text-white" />
    </button>
    <button
      id="audio-play-button"
      class="p-2 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
      onclick={onPlayPauseClick}
      disabled={store.status === 'stopped'}
      title="Play/Pause"
    >
      {#if store.status === 'playing'}
        <Pause class="text-white" />
      {:else}
        <Play class="text-white" />
      {/if}
    </button>
    <button
      class="p-2 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
      onclick={onFastForward}
      disabled={store.status === 'stopped'}
      title="Fast Forward"
    >
      <FastForward class="text-white" />
    </button>
  </div>
  <div class="w-full md:max-w-[calc(100%-500px)]">
    <input
      disabled={store.status === 'stopped'}
      type="range"
      class="w-full disabled:opacity-30 accent-indigo-500 appearance-none bg-transparent
              [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-indigo-500/40
              [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:bg-indigo-500/40
              [&::-moz-range-track"
      min="0"
      max={store.endTimestamp || 0}
      bind:value={store.currentTimestamp}
      onchange={onSeek}
    />
    <span class="flex justify-between text-white">
      <span>{formattedCurrentTimestamp || '--:--'}</span>
      <span>{formattedEndTimestamp || '--:--'}</span>
    </span>
  </div>
</footer>
