<script lang="ts">
  import Bulb from './icons/Bulb.svelte';
  import BulbOff from './icons/BulbOff.svelte';
  import Disc from './icons/Disc.svelte';
  import Home from './icons/Home.svelte';
  import { store } from './store/store.svelte';

  const onHouseClick = () => {
    store.view = store.view === 'home' ? 'podcast-detail' : 'home';
  };

  const onBulbClick = () => {
    store.isOverlayVisible = !store.isOverlayVisible;
  };
</script>

<div class="absolute top-0 left-0 z-10 flex flex-col gap-2 m-2 md:m-8">
  <button
    class="flex items-center justify-center p-4 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
    onclick={onHouseClick}
    aria-label="view"
  >
    {#if store.view === 'home'}
      <Disc class="text-white" />
    {:else}
      <Home class="text-white" />
    {/if}
  </button>
  <button
    class="flex items-center justify-center p-4 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700"
    onclick={onBulbClick}
    aria-label="bulb"
  >
    {#if store.isOverlayVisible}
      <BulbOff class="text-white" />
    {:else}
      <Bulb class="text-white" />
    {/if}
  </button>
</div>
