<script lang="ts">
  import PodcastListElement from './PodcastListElement.svelte';

  const { podcasts } = $props();
</script>

<ul class="flex flex-col gap-2">
  {#each podcasts as podcast}
    <PodcastListElement {podcast} />
  {/each}
</ul>
