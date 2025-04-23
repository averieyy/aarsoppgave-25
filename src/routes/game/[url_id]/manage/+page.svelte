<script lang="ts">
  import { goto } from "$app/navigation";
  import Header from "$lib/components/header.svelte";
  import { toTime } from "$lib/timedisplay.js";

  const { data } = $props();
  let { client, game, speedruns } = $state(data);

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

    console.log('sadf');

    const file = files[0];
    if (file.size >= 33554432) {
      error = 'Files cannot be bigger than 32 GiB';
      return;
    }

    console.log('asfd');
    if (!file.type.startsWith('image/')) {
      error = 'File has to be an image';
      return;
    }

    console.log('saf');
    
    // Upload
    const form = new FormData();
    form.set('file', file);

    console.log('poto');

    fetch('/api/upload', {
      method: 'POST',
      body: form
    }).then(async resp => {
      if (!resp.ok) { error = (await resp.json()).message; return; }
      game.image = (await resp.json()).id;

      console.log('0920');

      // Update game image
      const r = await fetch('/api/game/image', {
        method: 'POST',
        body: JSON.stringify({ game: game.id, file: game.image })
      })

      console.log('092');

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
        <label for="gameimageselector">
          <div class="chosenimage">
            {#if game.image}
              <img src="/api/uploads/{game.image}" alt="{game.name}">
            {/if}
            <div class="plusoverlay">
              +
            </div>
          </div>
        </label>
        <input bind:files={files} hidden type="file" id="gameimageselector" class="fileselector">
        {#if descError}
          <span class="error">
            {descError}
          </span>
        {/if}
        <textarea class="input" bind:value={game.description}></textarea>
        <button onclick={() => saveDescription()}>Save</button>
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
                <div class="info">
                  <h3>{speedrun.displayname}</h3>
                  <span>{toTime(speedrun.score)}.{(speedrun.score % 1000).toString().padStart(3, '0')}</span>
                  <p>{speedrun.description}</p>
                </div>
                <div class="actions">
                  <button onclick={() => verify(speedrun.id)}>
                    ok
                  </button>
                  <button class="red" onclick={() => deny(speedrun.id)}>
                    deny
                  </button>
                  <button class="red" onclick={() => ban(speedrun.username)}>
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
</style>