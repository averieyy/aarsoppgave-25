<script lang="ts">
  import { goto } from "$app/navigation";
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  let { client, games } = $state(data);
  let { username, displayname } = $state(client);
  let { username: lastsavedusername, displayname: lastsaveddisplayname, profile_pic } = $state(client);

  // For uploading profile picture
  let files: FileList | undefined = $state(undefined);
  let fileError: string = $state('');

  async function save () {
    const resp = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ username, displayname: displayname || username })
    });
    if (!resp.ok) {
      // TODO: Display an error message
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
      
      // Update the profile picture
      await fetch('/api/profilepic', {
        method: 'POST',
        body: JSON.stringify({ uuid: profile_pic })
      });
    });
  });

  async function removeProfilePic () {
    const resp = await fetch('/api/profilepic', {
      method: 'DELETE'
    });

    if (!resp.ok) fileError = (await resp.json()).message;
    else profile_pic = '';
  }

  async function logout () {
    const resp = await fetch('/api/logout', { method: 'POST' });

    goto('/');
  }

  let saveshown = $derived(username == lastsavedusername && displayname == lastsaveddisplayname);

  let confirmdeleteopen = $state(false);

  async function deleteAccount() {
    const resp = await fetch('/api/deleteacc', { method: 'DELETE' });
    if (!resp.ok) {

    }
    else goto('/');
  }
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
        <div class="profilepic">
          <div class="outerpic">
            <label>
              {#if profile_pic}
                <img src="/api/uploads/{profile_pic}" alt="">
              {:else}  
                <div class="label">{'+'}</div>
              {/if}
              <input bind:files={files} type="file" max="1" hidden>
            </label>
          </div>
          {#if profile_pic}
            <button onclick={() => removeProfilePic()}>Remove profile picture</button>
          {/if}
        </div>
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
      <section>
        <h2>Danger</h2>
        <button class="red" onclick={() => logout()}>Log out</button>
        <button class="red" onclick={() => confirmdeleteopen = true}>Delete account</button>
      </section>
      <div class="bottom">
        <div class="outerbutton">
          <button onclick={() => save()} class="save red {saveshown ? 'hidden' : 'shown'}">Unsaved Changes</button>
        </div>
      </div>
      <div class="outerdeleteacc {confirmdeleteopen ? 'shown' : 'hidden'}">
        <div class="deleteacc">
          <h3>Are you sure?</h3>
          <p>This action is <span class="emphasis">irreverisble</span>. You will be logged out of this account, and all your speedruns will be hidden.</p>
          <button onclick={() => confirmdeleteopen = false}>No, take me back</button>
          <button onclick={() => deleteAccount()} class="red">Yes, I know what I'm doing</button>
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

    &:has(button:not(.shown)) {
      pointer-events: none;
    }

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
  .outerpic {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  label:has(input[type="file"]) {
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
  .profilepic {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .outerdeleteacc {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(1rem);

    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: height .5s ease;

    padding: 0 2rem;

    &.hidden {
      height: 0%;
    }

    overflow: hidden;
  }
  .deleteacc {
    padding: 1rem;
    background-color: var(--bg2);
    width: 500px;
    box-sizing: border-box;
    max-width: 100%;

    gap: .5rem;

    display: flex;
    flex-direction: column;
  }
  span.emphasis {
    color: var(--emphasis);
    text-decoration: .125rem solid underline;
  }
</style>