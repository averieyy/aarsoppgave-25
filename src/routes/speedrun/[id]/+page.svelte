<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import { toTime } from "$lib/timedisplay";

  const { data } = $props();
  let { client, speedrun, placement } = $state(data);

  let outerheight = $state(0);
  let innerheight = $state(0);

  let showmoredesc = $state(false);

  let moreavailable = $derived(innerheight > outerheight);
</script>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main>
      <div class="game">
        <h2>
          <a href="/game/{speedrun.url_id}" class="gameurl">
            {speedrun.game}
          </a>
        </h2>
        <p>{speedrun.game_desc}</p>
      </div>
      <div class="run">
        <h3>
          Speedrun in <span class="emphasis">{toTime(speedrun.score)}.{(speedrun.score % 1000).toString().padStart(3,'0')}</span>
        </h3>
        <span>In {placement}{(10 < placement % 100 && placement % 100 < 20) ? 'th' : (placement % 10 == 1) ? 'st' : (placement % 10 == 2) ? 'nd' : (placement % 10 == 3) ? 'rd' : 'th'} place</span>
        <div class="description">
          <div bind:clientHeight={outerheight} class="innerdesc {showmoredesc ? 'noshadow' : ''}">
            <p bind:clientHeight={innerheight}>
              {speedrun.description}
            </p>
          </div>
          {#if moreavailable || showmoredesc}
            <button class="moreless" onclick={() => showmoredesc = !showmoredesc}>{#if showmoredesc}Show less{:else}Show more{/if}</button>
          {/if}
        </div>
        <a href="/user/{speedrun.username}" class="button">View user profile</a>
      </div>
    </main>
  </div>
</div>

<style>
  h2 {
    font-weight: 600;
    font-size: 1.5rem;
  }

  h3 {
    font-weight: 500;
    font-size: 1.25rem;
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

  .game, .run {
    padding: 1rem;
    border-radius: .5rem;
    background-color: var(--bg2);
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  .emphasis {
    color: var(--emphasis);
  }
  
  .innerdesc {
    position: relative;
    border-left: .125rem solid var(--emphasis);
    border-radius: .125rem;
    max-height: 6rem;
    overflow: hidden;
    white-space-collapse: preserve;
    width: 100%;

    &.noshadow {
      max-height: none;

      &::noshadow { box-shadow: none; }
    }
    
    &>p {
      padding: .5rem;
      height: 100%;
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }

    &::before {
      position: absolute;
      width: 100%;
      height: 100%;
      content: '';
      box-shadow: inset 0 -1rem .5rem -.5rem var(--bg2);

      pointer-events: none;
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
  }

  .gameurl {
    color: var(--emphasis);
    text-decoration: .125rem solid underline;
  }
</style>