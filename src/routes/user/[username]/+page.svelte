<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import Speedrunlist from "$lib/components/speedrunlist.svelte";
  import { toTimeSince } from "$lib/timedisplay";

  const { data } = $props();
  let { client, user, speedruns, categories, games } = $state(data);

  let selectedgame: number = $state(games[0].id);
  
</script>

<svelte:head>
  <title>Speedrun - {user.username}</title>
</svelte:head>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main>
      <section class="titlesection">
        <h2>
          {#if user.profile_pic}
            <img src="/api/uploads/{user.profile_pic}" alt="{user.username}" class="profilepic">
          {/if}
          <span>
            <span class="emphasis">
              {user.username}'{user.username.endsWith('s') ? '' : 's'}
            </span>
            user page
          </span>
        </h2>
        <span class="joined">Joined {toTimeSince(user.joined)}</span>
      </section>
      <section>
        <h2>Speedruns</h2>
        <div class="outerspeedruns">
          <div class="speedrungames">
            {#each games as game}
              <button class="speedrunninggame {selectedgame == game.id ? 'selected' : ''}" onclick={() => selectedgame = game.id}>{game.name}</button>
            {/each}
          </div>
          <Speedrunlist speedruns={speedruns.filter(s => s.game_id == selectedgame) || []} categories={categories.filter(c => c.game_id == selectedgame).map(c => c.category_label)} />
        </div>
      </section>
    </main>
  </div>
</div>

<style>
  .emphasis {
    color: var(--emphasis);
  }
  section {
    padding: 1rem;
    background-color: var(--bg2);
    border-radius: .5rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .innerpage {
    align-items: center;
  }
  main {
    width: 750px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  h2 {
    padding: .5rem;
    border-bottom: .125rem solid var(--emphasis);
    border-radius: .125rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  .joined {
    font-style: italic;
  }
  .speedrungames {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }
  .speedrunninggame {
    border: none;
    border-bottom: .125rem solid transparent;

    background-color: var(--bg2);

    &:hover, &:active, &:focus {
      color: var(--fg1);
      background-color: var(--bg3);
    }

    &.selected {
      background-color: var(--bg3);
      border-bottom: .125rem var(--emphasis) solid;
    }
  }
  .outerspeedruns {
    display: flex;
    flex-direction: column;
  }
  .profilepic {
    border: .125rem solid var(--emphasis);
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    object-fit: cover;
  }
</style>