<script lang="ts">
    import Header from "$lib/components/header.svelte";

  const { data } = $props();
  let { client, game, gameMember } = $state(data);
</script>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main>
      <div class="speedruns">
        <span>No speedruns yet. Be the first one!</span>
      </div>
      <div class="info">
        <h1>{game.name}</h1>
        <div class="pair">
          <h3>Description</h3>
          <p>
            {game.description}
          </p>
        </div>
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
    border-bottom: .125rem solid var(--emphasis);
    font-size: 1.5rem;
  }
  main {
    display: flex;
    gap: .5rem;
    flex-direction: column-reverse;
    flex: 1;
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
    gap: .5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: .5rem;
    &>.pair {
      display: flex;
      flex-direction: column;
      gap: .5rem;

      &>p {
        padding-left: 1rem;
        border-left: .125rem solid var(--emphasis);
        border-radius: .125rem;
      }
    }
  }
  h3 {
    font-size: 1.2rem;
  }
</style>