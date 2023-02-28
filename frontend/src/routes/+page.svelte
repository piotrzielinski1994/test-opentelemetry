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
  <h1>Loading...</h1>
{:else if error}
  <h1 class="error">{error}</h1>
{:else}
  <h1>Playlists</h1>

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
    margin: 0;
    display: grid;
    place-content: center;
  }

  .error {
    color: red;
  }
</style>
