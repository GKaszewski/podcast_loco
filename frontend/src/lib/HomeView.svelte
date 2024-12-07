<script lang="ts">
  import { store } from './store/store.svelte';
  import Avatar from '../assets/avatar.png';
  import { createQuery } from '@tanstack/svelte-query';
  import { fetchPodcasts } from './api/fetchPodcasts';
  import PodcastsList from './PodcastsList.svelte';

  const podcastsQuery = createQuery({
    queryKey: ['podcasts'],
    queryFn: fetchPodcasts,
  });
</script>

<section class="flex items-center gap-2 p-8">
  <img
    class="object-cover object-center w-16 h-16 rounded-full select-none"
    src={Avatar}
    alt="avatar"
  />
  <h1 class="text-4xl text-white cursor-default hover:cool-text-gradient">
    Podcast
  </h1>
</section>
<section class="flex flex-col gap-2 w-full max-w-[600px] p-4">
  <h2 class="text-2xl text-white cursor-default hover:cool-text-gradient">
    Episodes
  </h2>
  {#if $podcastsQuery.isLoading}
    <span class="loader"></span>
  {:else if $podcastsQuery.isError}
    <p class="text-2xl font-semibold text-red-500">Something went wrong 🥲</p>
  {:else if $podcastsQuery.isSuccess}
    <PodcastsList podcasts={$podcastsQuery.data} />
  {/if}
</section>
