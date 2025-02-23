<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import Speedrunlist from "$lib/components/speedrunlist.svelte";

  const { data } = $props();
  let { client, game, gameMember, speedruns } = $state(data);
</script>

<svelte:head>
  <title>Speedrun - {game.name}</title>
</svelte:head>

<div class="page">
  <Header {client} />
  <div class="innerpage">
    <main>
      <div class="speedruns">
        <Speedrunlist {speedruns} />
      </div>
      <div class="info">
        <h1>{game.name}</h1>
        <div class="pair">
          <h3>Description</h3>
          <p>
            {game.description}
          </p>
        </div>
        {#if gameMember}
          <a href="/game/{game.url_id}/newrun" class="button">Submit run</a>
        {:else}
          <a href="/login?redirect=/game/{game.url_id}/newrun" class="button"
            >Log in to submit run</a
          >
        {/if}
      </div>
    </main>
  </div>
</div>

<style>
  @media (min-width: 700px) {
    main {
      flex-direction: row !important;
    }
  }
  h1 {
    border-bottom: 0.125rem solid var(--emphasis);
    font-size: 1.5rem;
  }
  .innerpage {
    align-items: center;
  }
  main {
    display: flex;
    gap: 0.5rem;
    flex-direction: column-reverse;
    flex: 1;
    max-width: 750px;
    width: 100%;
    box-sizing: border-box;
  }
  .speedruns {
    flex: 1;
  }
  .info {
    min-width: 300px;
    background-color: var(--bg2);
    height: fit-content;
    padding: 1rem;
    box-sizing: border-box;
    gap: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 0.5rem;
    & > .pair {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      & > p {
        padding-left: 1rem;
        border-left: 0.125rem solid var(--emphasis);
        border-radius: 0.125rem;
      }
    }
  }
  h3 {
    font-size: 1.2rem;
  }
</style>
