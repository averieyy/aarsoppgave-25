<script lang="ts">
  import Header from "$lib/components/header.svelte";
    import { toTime } from "$lib/timedisplay.js";

  const { data } = $props();
  let { client, game, speedruns } = $state(data);
</script>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main>
      <h1>
        Managing <a href="/game/{game.url_id}" class="special">{game.name}</a>
      </h1>
      <section>
        <h2>Speedruns</h2>
        <div class="speedruns">
          {#if speedruns.length == 0}
            <span class="speedrun missing">
              No unvalidated speedruns
            </span>
          {:else}
            {#each speedruns as speedrun}
              <div class="speedrun">
                <div class="info">
                  <h3>{speedrun.username}</h3>
                  <span>{toTime(speedrun.score)}.{(speedrun.score % 1000).toString().padStart(3, '0')}</span>
                  <p>{speedrun.description}</p>
                </div>
                <div class="actions">
                  <button>
                    ok
                  </button>
                  <button class="red">
                    deny
                  </button>
                  <button class="red">
                    ban
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </section>
    </main>
  </div>
</div>

<style>
  main {
    width: 750px;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .innerpage {
    align-items: center;
  }
  .special {
    color: var(--emphasis);
  }
  .speedruns {
    display: flex;
    flex-direction: column;
  }
  .speedrun {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    
    padding: .5rem;
    border-radius: .25rem;

    &:nth-child(odd) {
      background-color: var(--bg2);

      &>.info>p::before {
        box-shadow: inset 0 -4rem 2rem -3rem var(--bg2);
      }
    }
    &:nth-child(even) {
      background-color: var(--bg3);

      &>.info>p::before {
        box-shadow: inset 0 -4rem 2rem -3rem var(--bg3);
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    overflow: hidden;

    flex: 1;

    white-space-collapse: preserve-breaks;

    &>h3, &>span {
      text-wrap: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &>p {
      overflow: hidden;
      text-overflow: clip;
      max-height: 5rem;

      position: relative;

      &::before {
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 5rem;
        pointer-events: none;
        position: absolute;
      }
    }
  }
  section {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: .5rem;
    background-color: var(--bg2);
    border-radius: .5rem;
  }
  .actions {
    display: flex;
    flex-direction: row;
    gap: .5rem;

    justify-content: center;

    &>button {
      padding: 0;
      width: 2.75rem;
      height: 2.75rem;
      margin: 0;
    }
  }
  .missing {
    color: var(--fg3);
    font-style: italic;

  }
</style>