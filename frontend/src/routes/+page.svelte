<script>
  import { PUBLIC_DOMAIN } from '$env/static/public';
  import { onMount } from 'svelte';

  let isLoading = false;
  let playlists = [];
  let error = '';

  onMount(() => {
    isLoading = true;

    fetch(`https://playlists.${PUBLIC_DOMAIN}`)
      .then((res) => res.json())
      .then((data) => (playlists = data))
      .catch((e) => (error = 'Ups, something went wrong'))
      .finally(() => (isLoading = false));
  });
</script>

{#if isLoading}
  <h2>Loading...</h2>
{:else if error}
  <h2 class="error">{error}</h2>
{:else}
  {#each playlists as playlist}
    <h2>{playlist.name}</h2>
    <ul>
      {#each playlist.videos as video}
        <li>{video.name}</li>
      {/each}
    </ul>
  {/each}
{/if}

<style>
  :global(body) {
    min-height: 100vh;
    display: grid;
    place-content: center;
  }

  .error {
    color: red;
  }
</style>
