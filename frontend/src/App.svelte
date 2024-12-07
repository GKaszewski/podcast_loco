<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { shortcut, type ShortcutEventDetail } from '@svelte-put/shortcut';
  import Audio from './lib/Audio.svelte';
  import AudioSpectrum from './lib/AudioSpectrum.svelte';
  import HomeView from './lib/HomeView.svelte';
  import Overlay from './lib/Overlay.svelte';
  import PlaybackControl from './lib/PlaybackControl.svelte';
  import PodcastDetailView from './lib/PodcastDetailView.svelte';
  import { SEEK_STEP, store } from './lib/store/store.svelte';
  import TopButtons from './lib/TopButtons.svelte';

  const queryClient = new QueryClient();

  const handleSpace = (detail: ShortcutEventDetail) => {
    if (store.currentPodcast) {
      store.togglePlayback();
    }
  };

  const handleKeyLeft = (detail: ShortcutEventDetail) => {
    if (store.currentPodcast) {
      store.seekBackward(SEEK_STEP);
    }
  };

  const handleKeyRight = (detail: ShortcutEventDetail) => {
    if (store.currentPodcast) {
      store.seekForward(SEEK_STEP);
    }
  };

  const handleO = (detail: ShortcutEventDetail) => {
    store.isOverlayVisible = !store.isOverlayVisible;
  };
</script>

<svelte:window
  use:shortcut={{
    trigger: { key: ' ', modifier: [], callback: handleSpace },
  }}
  use:shortcut={{
    trigger: { key: 'ArrowLeft', modifier: [], callback: handleKeyLeft },
  }}
  use:shortcut={{
    trigger: { key: 'ArrowRight', modifier: [], callback: handleKeyRight },
  }}
  use:shortcut={{
    trigger: { key: 'o', modifier: [], callback: handleO },
  }}
/>

<QueryClientProvider client={queryClient}
  ><main
    class="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-slate-950 via-indigo-900 to-slate-900"
  >
    <Audio />
    {#if store.isOverlayVisible}
      <Overlay />
    {/if}
    <TopButtons />

    {#if store.view === 'home'}
      <HomeView />
    {:else}
      <PodcastDetailView />
    {/if}
    <span class="flex-1"></span>
    <PlaybackControl />
    <AudioSpectrum />
  </main>
</QueryClientProvider>
