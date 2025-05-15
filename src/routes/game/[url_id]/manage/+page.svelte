<script lang="ts">
  import { goto } from "$app/navigation";
  import CategoryManage from "$lib/components/categoryManage.svelte";
  import Header from "$lib/components/header.svelte";
  import { toTime } from "$lib/timedisplay.js";

  const { data } = $props();
  let { client, game, speedruns, categories } = $state(data);

  let error = $state('');

  async function verify (speedrun: number) {
    // remove
    let oldspeedruns = $state.snapshot(speedruns);
    speedruns.splice(speedruns.findIndex(s => s.id == speedrun), 1);
    speedruns = speedruns;

    const resp = await fetch('/api/game/verify', {
      method: 'POST',
      body: JSON.stringify({ speedrun }),
    });

    if (resp.status == 403) await goto(`/game/${game.url_id}`);
    if (!resp.ok) {
      speedruns = oldspeedruns;
      error = (await resp.json()).message;
    }
  }

  async function deny (speedrun: number) {
    // remove
    let oldspeedruns = $state.snapshot(speedruns);
    speedruns.splice(speedruns.findIndex(s => s.id == speedrun), 1);
    speedruns = speedruns;

    const resp = await fetch('/api/game/deny', {
      method: 'POST',
      body: JSON.stringify({ speedrun }),
    });

    if (resp.status == 403) await goto(`/game/${game.url_id}`);
    if (!resp.ok) {
      speedruns = oldspeedruns;
      error = (await resp.json()).message;
    }
  }

  async function ban(username: string) {
    // remove
    let oldspeedrus = $state.snapshot(speedruns);
    speedruns = speedruns.filter(s => s.username != username);
    
    const resp = await fetch('/api/game/ban', {
      method: 'POST',
      body: JSON.stringify({ game: game.url_id, target: username })
    });
    
    if (resp.status == 403) await goto(`/game/${game.url_id}`);
    if (!resp.ok) {
      speedruns = oldspeedrus;
      error = (await resp.json()).message;
    }
  }

  let files: FileList | undefined = $state(undefined);

  $effect(() => {
    files;

    if (!files || files.length == 0) return;
    if (files.length > 1) {
      error = 'You can only select one file';
      return;
    }

    const file = files[0];
    if (file.size >= 33554432) {
      error = 'Files cannot be bigger than 32 GiB';
      return;
    }

    if (!file.type.startsWith('image/')) {
      error = 'File has to be an image';
      return;
    }
    
    // Upload
    const form = new FormData();
    form.set('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: form
    }).then(async resp => {
      if (!resp.ok) { error = (await resp.json()).message; return; }
      game.image = (await resp.json()).id;

      // Update game image
      const r = await fetch('/api/game/image', {
        method: 'POST',
        body: JSON.stringify({ game: game.id, file: game.image })
      })

      if (!r.ok) {
        error = (await r.json()).message;
        return;
      }
    });
  });

  let descError = $state('');

  async function saveDescription () {
    await fetch('/api/game/description', {
      method: 'POST',
      body: JSON.stringify({ description: game.description, game: game.url_id })
    });
  }
</script>

<svelte:head>
  <title>Speedrun - Manage {game.name}</title>
</svelte:head>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main>
      <h1>
        Managing <a href="/game/{game.url_id}" class="special">{game.name}</a>
      </h1>
      {#if error}
        <span class="error">{error}</span>
      {/if}
      <section>
        <h2>Appearance</h2>
        <input type="text" placeholder="Name" bind:value={game.name}>
        <label>
          <div class="chosenimage">
            {#if game.image}
              <img src="/api/uploads/{game.image}" alt="{game.name}">
            {/if}
            <div class="plusoverlay">
              +
            </div>
          </div>
          <input bind:files={files} hidden type="file" class="fileselector">
        </label>
        {#if descError}
          <span class="error">
            {descError}
          </span>
        {/if}
        <textarea class="input" bind:value={game.description}></textarea>
        <button onclick={() => saveDescription()}>Save</button>
      </section>
      <section>
        <h2>Categories</h2>
        <div class="categories">
          {#each categories as category}
            <CategoryManage game={game.id} {category} />
          {/each}
          <CategoryManage game={game.id} addToList={(c,m,r) => categories.push({category_label: c, game_id: game.id, id: -1, proof_match: m, require_proof: r}) } />
        </div>
      </section>
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
                <div class="infoactions">
                  <div class="info">
                    <span>{toTime(speedrun.score)}.{(speedrun.score % 1000).toString().padStart(3, '0')}</span>
                    <p class="speedrundesc">{speedrun.description}</p>
                    <span>By <a href="/user/{speedrun.username}" class="link">{speedrun.displayname}</a></span>
                    <a href="/speedrun/{speedrun.id}" class="button">More information</a>
                  </div>
                  <div class="actions">
                    <button title="Verify run" onclick={() => verify(speedrun.id)} aria-label="verify">
                      <svg viewBox="0 0 1 1">
                        <path
                          d="M1 .2 L 0.9 0.1 L 0.3 0.7 L 0.1 0.5 L 0 0.6 L 0.3 0.9 Z">
                        </path>
                      </svg>
                    </button>
                    <button title="Deny run" class="red" onclick={() => deny(speedrun.id)} aria-label="deny">
                      <svg viewBox="0 0 1 1">
                        <path
                          d="M.1 .2 L .2 .1 L .5 .4 L .8 .1 L .9 .2 L .6 .5 L .9 .8 L .8 .9 L .5 .6 L .2 .9 L .1 .8 L .4 .5 Z">
                        </path>
                      </svg>
                    </button>
                    <button title="Ban user" class="red" onclick={() => ban(speedrun.username)} aria-label="ban user">
                      <svg viewBox="0 0 1 1">
                        <path
                          d="M.05 .85 L .4 .5 L .25 .35 L .45 .15 L .85 .55 L .65 .75 L .5 .6 L .15 .95Z">
                        </path>
                        <path
                          d="M .4 1 L .5 .9 L .9 .9 L 1 1 Z">
                        </path>
                      </svg>
                    </button>
                  </div>
                </div>
                {#if speedrun.proof}
                  <div class="proof">
                    {#if speedrun.proofmime!.startsWith('video')}
                      <video>
                        <source src="/api/uploads/{speedrun.proof}" type="{speedrun.proofmime}">
                        <track kind="captions">
                      </video>
                    {:else if speedrun.proofmime!.startsWith('image')}
                      <img src="/api/uploads/{speedrun.proof}" alt="Proof for speedrun">
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      </section>
    </main>
  </div>
</div>

<style>
  @media (max-width: 500px) {
    .speedrun {
      flex-direction: column !important;

      &>.proof {
        width: 100% !important;
        height: 10rem !important;
      }
    }
  }

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
    flex-direction: row;
    
    &>.infoactions {
      display: flex;
      flex-direction: column;
      gap: .5rem;
      flex: 1;
    }
    gap: .5rem;
    
    padding: .5rem;
    border-radius: .25rem;

    &:nth-child(odd) {
      background-color: var(--bg3);

      & .info>p::before {
        box-shadow: inset 0 -4rem 2rem -3rem var(--bg3);
      }
    }
    &:nth-child(even) {
      background-color: var(--bg2);

      & .info>p::before {
        box-shadow: inset 0 -4rem 2rem -3rem var(--bg2);
      }
    }

    &>.proof {
      height: auto;
      width: 10rem;
      
      &>img, &>video {
        width: 100%;
        height: 100%;
        object-fit: contain;
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

    &>span {
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
      padding: .25rem;
      width: 2.75rem;
      height: 2.75rem;
      margin: 0;

      &>svg>path {
        fill: var(--emphasis);
      }

      &.red {
        &>svg>path {
          fill: var(--red);
        }
      }

      &:hover, &:active, &:focus-visible {
        &>svg>path {
          fill: var(--fg-emphasis);
        }

        &.red {
          &>svg>path {
            fill: var(--fg-emphasis);
          }
        }
      }
    }
  }
  .missing {
    color: var(--fg3);
    font-style: italic;
  }
  label {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .chosenimage {
    width: 7.5rem;
    height: 7.5rem;
    border: .125rem solid var(--emphasis);
    border-radius: .5rem;
    position: relative;
    overflow: hidden;

    &>.plusoverlay {
      width: 100%;
      height: 100%;
      color: transparent;
      background-color: transparent;
      position: absolute;
      top: 0;
      left: 0;
    }
    &>.plusoverlay:hover {
      background-color: var(--emphasis);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--fg-emphasis);
    }
    &>img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  textarea {
    resize: vertical;
    height: 5rem;
  }
  .categories {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
</style>