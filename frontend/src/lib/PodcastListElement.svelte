<script lang="ts">
  import Pause from './icons/Pause.svelte';
  import Play from './icons/Play.svelte';
  import { store } from './store/store.svelte';

  let { podcast } = $props();

  let isSelected = $derived(store.currentPodcast?.id === podcast.id);

  const handleOnClick = () => {
    if (isSelected && store.currentPodcast?.id === podcast.id) {
      if (store.status === 'playing') {
        store.pause();
      } else {
        store.play();
      }
    }

    if (store.currentPodcast?.id !== podcast.id) {
      store.reset();
      store.currentPodcast = podcast;
      store.view = 'podcast-detail';
    }
  };
</script>

<li
  class="flex items-center justify-between p-4 rounded-md backdrop-blur-3xl hover:ring-1 ring-indigo-600/60 {isSelected
    ? 'bg-slate-900/60'
    : 'bg-slate-900'}"
>
  <span class="text-white cursor-default">{podcast.title}</span>
  <button
    class="p-2 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700"
    onclick={handleOnClick}
    aria-label="play"
    title="Play"
  >
    {#if store.status === 'playing' && isSelected}
      <Pause class="text-white" />
    {:else}
      <Play class="text-white" />
    {/if}
  </button>
</li>
