<script lang="ts">
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  
  let { client, games } = $state(data);
</script>

<svelte:head>
  <title>Speedrun - Games list</title>
</svelte:head>

<div class="page">
  <Header client={client}/>
  <div class="innerpage">
    <main>
      {#each games as game}
        <a class="game" href="/game/{game.url_id}">
          <h2>
            {game.name}
          </h2>
          <p>
            {game.description}
          </p>
        </a>
      {/each}
    </main>
  </div>
</div>

<style>
  .innerpage {
    align-items: center;
  }
  main {
    width: 100%;
    box-sizing: border-box;
    max-width: 750px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: .5rem;
  }
  .game {
    background-color: var(--bg2);
    padding: .5rem;
    text-decoration: none;
    aspect-ratio: 2 / 1;
    max-height: 9rem;
    box-sizing: border-box;
    width: 100%;

    display: flex;
    flex-direction: column;

    gap: .5rem;

    &>p {
      flex: 1;
      text-overflow: ellipsis;
    }
  }
  h2 {
    font-size: 1.25rem;
    border-bottom: .125rem solid var(--emphasis);
  }
</style>