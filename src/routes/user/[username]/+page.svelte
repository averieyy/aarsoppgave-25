<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import Speedrunlist from "$lib/components/speedrunlist.svelte";
  import { toTimeSince } from "$lib/timedisplay";

  const { data } = $props();
  let { client, user, speedruns } = $state(data);

  let speedrunninggames: [string, number][] = [];
  
  for (let i in speedruns) {
    speedrunninggames.push([speedruns[i][0].name, speedruns[i][0].game_id]);
  }

  let selectedgame: number = $state(speedrunninggames[0][1]);
</script>

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
            {#each speedrunninggames as game}
              <button class="speedrunninggame {selectedgame == game[1] ? 'selected' : ''}" onclick={() => selectedgame = game[1]}>{game[0]}</button>
            {/each}
          </div>
          <Speedrunlist speedruns={speedruns[selectedgame] || []} />
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