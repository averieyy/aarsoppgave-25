<script lang="ts">
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  let { client, games } = $state(data);
  let { username, displayname } = $state(client);
  let { username: lastsavedusername, displayname: lastsaveddisplayname } = $state(client);

  let files: FileList | undefined = $state(undefined);
  let fileError: string = $state('');

  let profile_pic: string | undefined = $state(undefined);

  async function save () {
    const resp = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ username, displayname: displayname || username })
    });
    if (!resp.ok) {
      // Display an error message
    }
    else {
      lastsavedusername = username;
      lastsaveddisplayname = displayname;
      return;
    }
  }

  $effect(() => {
    files;
    if (!files) return;
    if (files.length > 1) {
      fileError = 'You can only select 1 file.';
      return;
    }

    const file = files.item(0);
    if (!file) return;
    
    if (file.size > 33554432) {
      fileError = 'Files cannot be larger than 32MB.';
      return;
    }

    // Upload
    const formdata = new FormData();
    formdata.set('file', file);
    
    fetch('/api/upload', {
      method: 'POST',
      body: formdata,
    }).then(async resp => {
      const json = await resp.json();
      profile_pic = json.id;  
    });
  });

  let saveshown = $derived(username == lastsavedusername && displayname == lastsaveddisplayname);
</script>

<svelte:head>
  <title>Speedrun - User settings</title>
</svelte:head>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main>
      <section>
        <h2>Settings</h2>
        <h3>Username</h3>
        <input type="text" placeholder="Username" bind:value={username}>
        <h3>Display name</h3>
        <input type="text" placeholder={username} bind:value={displayname}>
        <h3>Profile picture</h3>
        {#if fileError}
          <span class="error">{fileError}</span>
        {/if}
        <label for="profilepic">
          {#if profile_pic}
            <img src="/api/uploads/{profile_pic}" alt="">
          {:else}  
            <div class="label">{'+'}</div>
          {/if}
        </label>
        <input bind:files={files} type="file" id="profilepic" max="1" hidden>
      </section>
      <section>
        <div class="games">
          {#each games as game}
            <div class="game">
              {game.name}
              <div class="nav">
                <a class="button" href="/game/{game.url_id}">View game</a>
                {#if game.admin}
                  <a class="button red" href="/game/{game.url_id}/manage">Manage</a>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <a href="/newgame" class="button">Create new game</a>
      </section>
      <div class="bottom">
        <div class="outerbutton">
          <button onclick={() => save()} class="save red {saveshown ? 'hidden' : 'shown'}">Unsaved Changes</button>
        </div>
      </div>
    </main>
  </div>
</div>

<style>
  section {
    padding: .5rem;
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
    display: flex;
    flex-direction: column;
    width: 750px;
    max-width: 100%;
    gap: .5rem;
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    left: 0;
    padding: .5rem;

    &>.outerbutton {
      overflow: hidden;
      
      display: flex;
      flex-direction: column; 
      
      &>button {
        transition: translate .5s ease;
        &.shown {
          translate: 0 0;
        }
  
        &.hidden {
          translate: 0 100%;
        }
      }
    }
  }
  .games {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .game {
    padding: .5rem;
    box-sizing: border-box;
    background-color: var(--bg3);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    & .nav {
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }
    min-height: 5rem;
  }
  label[for="profilepic"] {
    width: 10rem;
    height: 10rem;
    background-color: var(--bg3);
    border-radius: 100%;
    border: .25rem solid var(--bg3);
    display: flex;
    overflow: hidden;

    &:hover, &:active {
      &>.label {
        background-color: color-mix(in srgb, var(--emphasis) 50%, #00000000 50%);
        color: var(--fg-emphasis);
      }
    }

    &>img {
      flex: 1;
      object-fit: cover;
      object-position: 50% 50%;
    }
    
    &>.label {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      background-color: color-mix(in srgb, var(--bg3) 50%, #00000000 50%);
      user-select: none;
    }
  }
</style>