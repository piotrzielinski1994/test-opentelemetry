<script>
  import { PUBLIC_DOMAIN } from '$env/static/public';
  import { onMount } from 'svelte';

  let isLoading = true;
  let playlists = [];
  let error = '';
  let counter = 0;
  let timeout = null;

  onMount(() => {
    startCounting();

    fetch(`https://playlists.${PUBLIC_DOMAIN}/playlists`)
      .then((res) => res.json())
      .then((data) => (playlists = data))
      .catch((e) => (error = 'Ups, something went wrong'))
      .finally(resetCounter);
  });

  const startCounting = () => {
    isLoading = true;
    timeout = setInterval(() => counter++, 1000);
  };

  const resetCounter = () => {
    clearInterval(timeout);
    isLoading = false;
    counter = 0;
  };
</script>

{#if isLoading}
  <h1>Loading... {counter}</h1>
{:else if error}
  <h1 class="error">{error}</h1>
{:else}
  <h1>Playlists</h1>

  {#each playlists as playlist}
    <h2>{playlist.title}</h2>

    <ul>
      {#each playlist.videos as video}
        <li>{video.title}</li>
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
