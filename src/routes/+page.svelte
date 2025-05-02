<script lang="ts">
  import Gamelist from "$lib/components/gamelist.svelte";
  import Header from "$lib/components/header.svelte";
  import { toTimeSince } from '$lib/timedisplay';

  const { data } = $props();
  let { client, lastspeedrungames, games } = $state(data);
</script>

<svelte:head>
  <title>Speedrun - Main page</title>
</svelte:head>

<div class="page">
  <Header client={client}/>
  <div class="innerpage">
    <main>
      <div class="info">
        <h2>Welcome to speedrun.[tld]</h2>
        <p>
          Speedrun.[tld] is a respected website for speedruns of all kinds.
        </p>
        <a class="link moreabout" href="/about">More</a>
      </div>
      <div class="recentruns">
        <h2>Recent runs</h2>
        <div class="outerrunlist">
          <div class="runlist">
            {#each lastspeedrungames as speedrun}
              <a class="recent" href="/speedrun/{speedrun.id}">
                <h3>
                  {speedrun.name} - {speedrun.category_id}
                </h3>
                <span>{toTimeSince(speedrun.submitted)}</span>
                <span class="flexexpand"></span>
                <span class="speedrunname">
                  {#if speedrun.profile_pic}
                    <img src="/api/uploads/{speedrun.profile_pic}" alt="{speedrun.displayname}" class="profile_pic">
                  {/if}
                  {speedrun.displayname}
                </span>
              </a>
            {/each}
          </div>
        </div>
      </div>
      <div class="games">
        <h2>Games</h2>
        <Gamelist games={games} light />
        <a href="/games" class="button">Show all games</a>
      </div>
    </main>
  </div>
</div>

<style>
  .innerpage {
    align-items: center;
  }
  h2 {
    border-bottom: .125rem solid var(--emphasis);
  }
  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    width: 750px;
    max-width: 100%;
    box-sizing: border-box;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    padding: 1rem;
    background-color: var(--bg2);
    border-radius: .5rem;
  }
  .recentruns {
    padding: 1rem;
    border-radius: .5rem;
    background-color: var(--bg2);

    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .outerrunlist {
    overflow-x: auto;
    width: 100%;
  }
  .runlist {
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
    width: fit-content;
    justify-content: center;

    gap: .5rem;
  }
  .recent {
    background-color: var(--bg3);
    padding: .5rem;
    border-radius: .25rem;

    display: flex;
    flex-direction: column;
    gap: .25rem;

    text-decoration: none;
    
    height: 7rem;
    width: 12rem;

  }
  .games {
    padding: 1rem;
    border-radius: .5rem;
    background-color: var(--bg2);
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .flexexpand {
    flex: 1;
  }
  .speedrunname {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    align-items: center;
    &> img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      border: .125rem solid var(--emphasis);
    }
  }
  .moreabout {
    display: flex;
    flex-direction: row;
    padding: .5rem;
    gap: .5rem;
    text-decoration: none;
    align-items: center;
    border-bottom: .125rem solid var(--emphasis);
    width: fit-content;

    border-radius: .25rem;
    
    &::after {
      content: '';
      background-color: var(--emphasis);
      width: .375rem;
      height: .75rem;
      clip-path: polygon(0 0, 100% 50%, 0% 100%, 0% 80%, 60% 50%, 0% 20%);
    }

    &:active::after {
      background-color: var(--emphasis-dark);
    }
  }
</style>