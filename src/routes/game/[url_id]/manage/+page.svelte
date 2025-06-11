<script lang="ts">
  import { goto } from "$app/navigation";
  import CategoryManage from "$lib/components/gamemanage/categoryManage.svelte";
  import Administrators from "$lib/components/gamemanage/administrators.svelte";
  import BannedMembers from "$lib/components/gamemanage/bannedMembers.svelte";
  import Header from "$lib/components/header.svelte";
  import IconButton from "$lib/components/iconButton.svelte";
  import Proof from "$lib/components/proof.svelte";
  import { toTime } from "$lib/timedisplay.js";

  const { data } = $props();
  let { client, game, speedruns, categories, members } = $state(data);

  let error = $state('');

  async function verify (speedrun: number) {
    // Remove the speedrun from the local list
    let oldspeedruns = $state.snapshot(speedruns);
    speedruns.splice(speedruns.findIndex(s => s.id == speedrun), 1);
    // Update the display
    speedruns = speedruns;

    // Send POST request
    const resp = await fetch('/api/game/verify', {
      method: 'POST',
      body: JSON.stringify({ speedrun }),
    });

    // Redirect to the game page if the client is unauthorized
    if (resp.status == 403) await goto(`/game/${game.url_id}`);
    if (!resp.ok) {
      // Return to the old speedruns locally
      speedruns = oldspeedruns;
      // Show the error message
      error = (await resp.json()).message;
    }
  }

  async function deny (speedrun: number) {
    // Remove the speedrun from the local list
    let oldspeedruns = $state.snapshot(speedruns);
    speedruns.splice(speedruns.findIndex(s => s.id == speedrun), 1);
    // Reload the display
    speedruns = speedruns;

    // Send POST request
    const resp = await fetch('/api/game/deny', {
      method: 'POST',
      body: JSON.stringify({ speedrun }),
    });

    // Redirect to the game page if the client is unauthorized
    if (resp.status == 403) await goto(`/game/${game.url_id}`);
    if (!resp.ok) {
      // Return to the old speedruns
      speedruns = oldspeedruns;
      // Show the error message
      error = (await resp.json()).message;
    }
  }

  // The selected image file
  let files: FileList | undefined = $state();
  let selectedFile: File | undefined = $derived(files?.[0]);

  async function getDataUrl(file: File): Promise<string | undefined> {
    return new Promise((res, _) => {
      // Create a file reader (this will be able to read the file data url)
      const fr = new FileReader();

      fr.onload = () => {
        // When finished, return the data URL
        res(fr.result?.toString());
      }

      // Get the data url
      if (!file) res(undefined);
      else fr.readAsDataURL(file);
    });
  }

  // When the input file gets updated, update the games image
  $effect(() => {
    selectedFile;

    // Make sure one file is selected
    if (!selectedFile) return;

    // Check if it is larger than 32MiB
    if (selectedFile.size >= 33554432) {
      error = 'Files cannot be bigger than 32 MiB';
      return;
    }

    // Check if the file is an image
    if (!selectedFile.type.startsWith('image/')) {
      error = 'File has to be an image';
      return;
    }
  });

  // List of administrators
  let administrators = $state(members.filter(m => m.admin));

  // Banned members
  let bannedmembers = $state(members.filter(m => m.banned));

  async function ban(username: string) {
    // Remove the speedrun locally
    const oldspeedrus = $state.snapshot(speedruns);
    speedruns = speedruns.filter(s => s.username != username);
    // Backup and add to banned list
    const bannedbackup = $state.snapshot(bannedmembers);
    const member = members.find(m => m.username == username);
    if (!member) return;
    bannedmembers.push(member);
    bannedmembers = bannedmembers;
    
    // Send POST request
    const resp = await fetch('/api/game/ban', {
      method: 'POST',
      body: JSON.stringify({ game: game.url_id, target: username })
    });
    
    // Redirect to the game page if the client is unauthorized
    if (resp.status == 403) await goto(`/game/${game.url_id}`);
    if (!resp.ok) {
      // Return to the old speedruns
      speedruns = oldspeedrus;
      bannedmembers = bannedbackup;
      // Show the error message
      error = (await resp.json()).message;
    }
  }

  let oldgame = data.game;
  let unsavedChanges = $derived(oldgame.name != game.name || oldgame.description != game.description || oldgame.image != game.image || selectedFile);

  async function saveAll () {
    // Save description
    if (oldgame.description != game.description)
      await fetch('/api/game/description', {
        method: 'POST',
        body: JSON.stringify({ description: game.description, game: game.url_id })
      }).then(async r => {
        if (r.ok) oldgame.description = game.description;
        else error = (await r.json()).message;
      });

    // Save title
    if (oldgame.name != game.name)
      await fetch('/api/game/title', {
        method: 'POST',
        body: JSON.stringify({ name: game.name, game: game.url_id })
      }).then(async r => {
        if (r.ok) oldgame.name = game.name;
        else error = (await r.json()).message;
      });

    // Save image
    if (oldgame.image != game.image)
      await fetch('/api/game/image', {
        method: 'POST',
        body: JSON.stringify({ file: game.image, game: game.url_id })
      }).then(async r => {
        if (r.ok) oldgame.image = game.image;
        else error = (await r.json()).message;
      });

    if (selectedFile) {
      const form = new FormData();
      form.set('file', selectedFile);

      await fetch('/api/upload', {
        method: 'POST',
        body: form
      }).then(async r => {
        if (r.ok) {
          const path = (await r.json()).id;
          await fetch('/api/game/image', {
            method: 'POST',
            body: JSON.stringify({ game: game.url_id, file: path })
          }).then(async r => {
            if (r.ok) {
              game.image = path;
              files = undefined;
              oldgame.image = game.image;
            }
            else error = (await r.json()).message;
          });
        }
        else error = (await r.json()).message;
      });
    }

    oldgame = oldgame;
    game = game;
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
        <div class="title">
          <input type="text" placeholder="Name" bind:value={game.name}>
        </div>
        <label>
          <div class="chosenimage">
            {#if files && files.length == 1}
              {#await getDataUrl(files[0])}
                <span>Loading...</span>
              {:then url}
                <img src={url} alt="{game.name}">
              {/await}
            {:else if game.image}
              <img src="/api/uploads/{game.image}" alt="{game.name}">
            {/if}
            <div class="plusoverlay">
              +
            </div>
          </div>
          <input bind:files={files} hidden type="file" class="fileselector">
        </label>
        <textarea class="input" bind:value={game.description}></textarea>
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
        <h2>Users</h2>
        <Administrators { administrators } { members } { client } { error } { game }/>
        <BannedMembers { bannedmembers } { error } { game } { members } />
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
                    <IconButton label="Verify run" bg={3} onclick={() => verify(speedrun.id)}
                      path="M10 2L9 1L3 7L1 5L0 6L3 9Z"/>
                    <IconButton label="Deny run" bg={3} onclick={() => deny(speedrun.id)}
                      path="M1 2L2 1L5 4L8 1L9 2L6 5L9 8L8 9L5 6L2 9L1 8L4 5Z"/>
                    <IconButton label="Ban user" bg={3} red viewBox="0 0 20 20" onclick={() => ban(speedrun.username)}
                      path="M1 17L8 10L5 7L9 3L17 11L13 15L10 12L3 19Z M8 20L10 18L18 18L20 20Z"/>
                  </div>
                </div>
                {#if speedrun.proof}
                  <div class="proof">
                    <Proof mime={speedrun.proofmime as string} url={speedrun.proof}/>
                  </div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      </section>
    </main>
  </div>
  <div class="outersave {unsavedChanges ? 'shown' : 'hidden'}">
    <button onclick={() => saveAll()}>Save</button>
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
    }
    &:nth-child(even) {
      background-color: var(--bg2);
    }

    &>.proof {
      height: auto;
      width: 10rem;
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
  .title {
    display: flex;
    flex-direction: row;

    align-items: center;
    gap: .5rem;

    &>input {
      flex: 1;
    }
  }
  .outersave {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;

    display: flex;

    overflow: hidden;

    &.hidden>button {
      translate: 0 100%;
    }
    &.shown>button {
      translate: 0 0%;
    }

    &>button {
      flex: 1;
      transition: translate .5s ease;
    }
  }
</style>