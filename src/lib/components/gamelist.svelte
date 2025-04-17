<script lang="ts">
  import type { game } from "$lib/types";

  let { games, light }: { games: game[], light?: boolean } = $props();
</script>

<div class="games">
  {#each games as game}
    <a class="game {light ? 'light' : ''}" href="/game/{game.url_id}">
      {#if game.image}
        <img src="/api/uploads/{game.image}" alt="{game.name}">
      {/if}
      <div class="gameinfo">
        <h2>
          {game.name}
        </h2>
        <p>
          {game.description}
        </p>
      </div>
    </a>
  {/each}
</div>

<style>
  .games {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: .5rem;
  }
  .game {
    background-color: var(--bg2);
    padding: .5rem;
    border-radius: .25rem;
    text-decoration: none;
    aspect-ratio: 2 / 1;
    max-height: 9rem;
    box-sizing: border-box;
    width: 100%;

    display: flex;
    flex-direction: row;

    gap: .5rem;

    &>img {
      aspect-ratio: 1 / 1;
      object-fit: cover;
      height: 100%;
      border-radius: .5rem;
      border: .125rem solid var(--emphasis);
    }

    &>.gameinfo {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: .5rem;
      
      &>p {
        flex: 1;
        text-overflow: ellipsis;
      }
    }


    &.light {
      background-color: var(--bg3);
    }
  }
  h2 {
    font-size: 1.25rem;
    border-bottom: .125rem solid var(--emphasis);
  }
</style>