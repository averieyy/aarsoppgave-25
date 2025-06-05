<script lang="ts">
  import { goto } from "$app/navigation";
  import CategoryManage from "$lib/components/categoryManage.svelte";
  import Header from "$lib/components/header.svelte";
  import IconButton from "$lib/components/iconButton.svelte";
  import Proof from "$lib/components/proof.svelte";
  import { toTime } from "$lib/timedisplay.js";
  import type { frontendclient } from "$lib/types.js";

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
  let files: FileList | undefined = $state(undefined);

  // When the input file gets updated, update the games image
  $effect(() => {
    files;

    // Make sure one file is selected
    if (!files || files.length == 0) return;
    if (files.length > 1) {
      error = 'You can only select one file';
      return;
    }

    // Get the file
    const file = files[0];
    // Check if it is larger than 32MiB
    if (file.size >= 33554432) {
      error = 'Files cannot be bigger than 32 MiB';
      return;
    }

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      error = 'File has to be an image';
      return;
    }
    
    // Upload the image
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
    // Send request to edit description
    const resp = await fetch('/api/game/description', {
      method: 'POST',
      body: JSON.stringify({ description: game.description, game: game.url_id })
    });

    // Show an error if it failed
    if (!resp.ok) descError = (await resp.json()).message;
  }

  async function saveTitle () {
    // Send a request to edit the title (name)
    const resp = await fetch('/api/game/title', {
      method: 'POST',
      body: JSON.stringify({
        game: game.url_id,
        name: game.name
      })
    });

    // Show an error if it failed
    if (!resp.ok) error = (await resp.json()).message;
  }

  // List of administrators
  let administrators = $state(members.filter(m => m.admin));

  // Whether the admin input feild is shown
  let editingNewAdmin: boolean = $state(false);
  // The current name in the add admin input feild
  let newAdmin: string = $state('');

  // Sort members by how good their name matches the input admin username
  function sortMembers(searchString: string): frontendclient[] {
    return $state.snapshot(members).sort((a,b) => {
      // A's score, B's score
      let as = 0, bs = 0;

      // These parameters can be changed to whatever, found these work fine for me
      let usernameweight = 2;
      let displaynameweight = 1;

      // Check if the displaynames include the search string
      if (a.displayname.includes(searchString)) as += displaynameweight;
      if (b.displayname.includes(searchString)) bs += displaynameweight;

      // Check if the usernames include the search string
      if (a.username.includes(searchString)) as += usernameweight;
      if (b.username.includes(searchString)) bs += usernameweight;
      
      // Check if the displaynames start with the search string
      if (a.displayname.startsWith(searchString)) as += displaynameweight;
      if (b.displayname.startsWith(searchString)) bs += displaynameweight;

      // Check if the usernames start with the search string
      if (a.username.startsWith(searchString)) as += usernameweight;
      if (b.username.startsWith(searchString)) bs += usernameweight;

      // Return them so the one with the highest score comes first
      return bs - as;
    });
  }

  async function promoteUser() {
    // Take a backup of the current admin listing, before updating
    const adminsbackup = $state.snapshot(administrators);

    const newAdminObj = members.find(m => m.username == newAdmin);
    if (!newAdminObj) { return; }

    administrators.push(newAdminObj);
    administrators = administrators;

    // Send a request to promote the selected user
    const resp = await fetch('/api/game/promote', {
      method: 'POST',
      body: JSON.stringify({
        game: game.url_id,
        target: newAdmin
      })
    });

    // If it failed, revert to the backup and show error message
    if (!resp.ok) {
      administrators = adminsbackup;
      error = (await resp.json()).message;
    }
  }

  async function demoteUser(admin: string) {
    // Take a backup of the current admin listing, before updating
    const adminsbackup = $state.snapshot(administrators);

    const adminIndex = administrators.findIndex(a => a.username == admin);
    if (adminIndex == -1) { return; }

    administrators.splice(adminIndex, 1);
    administrators = administrators;

    // Send a request to demote the selected user
    const resp = await fetch('/api/game/demote', {
      method: 'POST',
      body: JSON.stringify({
        game: game.url_id,
        target: admin
      })
    });
    
    // If it failed, revert to the backup and show error message
    if (!resp.ok) {
      administrators = adminsbackup;
      error = (await resp.json()).message;
    }
  }

  // Banned members
  let bannedmembers = $state(members.filter(m => m.banned));
  let newBan = $state('');

  async function unban (username: string) {

    // Take backup of the current banned members and edit the list
    const bannedbackup = $state.snapshot(bannedmembers);
    const bannedindex = bannedmembers.findIndex(m => m.username == username);
    if (bannedindex == -1) return;
    bannedmembers.splice(bannedindex, 1);
    bannedmembers = bannedmembers;

    // Send POST request to unban member
    const resp = await fetch('/api/game/unban', {
      method: 'POST',
      body: JSON.stringify({
        game: game.url_id,
        username
      })
    });

    if (resp.status == 403) await goto(`/game/${game.url_id}`)
    if (!resp.ok) {
      // Show error message
      error = (await resp.json()).message;
      // Revert to backup
      bannedmembers = bannedbackup;
    }
  }

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
          <IconButton label="Edit category" onclick={() => saveTitle()}
            path="M8 0L10 2L3 9L1 9L1 7Z" />
        </div>
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
        <h2>Users</h2>
        <h3>Administrators</h3>
        <ul class="administrators">
          {#each administrators as admin}
            <li class="admin">
              <div class="name">
                {#if admin.profile_pic}
                  <img class="profilepic" src="/api/uploads/{admin.profile_pic}" alt="{admin.displayname}">
                {/if}
                <span class="adminname">{admin.displayname}</span>
              </div>
              {#if client?.username != admin.username}
                <div class="actions">
                  <IconButton bg={3} label="Remove as administrator" path="M1 2L2 1L5 4L8 1L9 2L6 5L9 8L8 9L5 6L2 9L1 8L4 5Z" onclick={() => demoteUser(admin.username)} />
                  <IconButton label="Ban user" bg={3} red viewBox="0 0 20 20"
                    path="M1 17L8 10L5 7L9 3L17 11L13 15L10 12L3 19Z M8 20L10 18L18 18L20 20Z"/>
                </div>
              {/if}
            </li>
          {/each}
          {#if editingNewAdmin}
            <li class="new">
              <div class="admininput">
                <input type="text" bind:value={newAdmin}>
                <div class="outersuggestions">
                  <div class="suggestions">
                    {#each sortMembers(newAdmin) as member}
                      <button class="suggestion" onclick={() => newAdmin = member.username}>
                        {member.displayname}
                      </button>
                    {/each}
                  </div>
                </div>
              </div>
              <IconButton path="M4 1L6 1L6 4L9 4L9 6L6 6L6 9L4 9L4 6L1 6L1 4L4 4Z" label="Add administrator" onclick={() => promoteUser() } />
            </li>
          {:else}
            <button class="add" onclick={() => editingNewAdmin = true} aria-label="Add administrator">
              <svg viewBox="0 0 10 10">
                <path
                  d="M4 1L6 1L6 4L9 4L9 6L6 6L6 9L4 9L4 6L1 6L1 4L4 4Z">
                </path>
              </svg>
            </button>
          {/if}
        </ul>
        <h3>Banned members</h3>
        <ul class="bannedmembers">
          {#if bannedmembers.length == 0}
            <span class="emptylist">No banned members</span>
          {:else}
            {#each bannedmembers as member}
              <li class="admin">
                <div class="name">
                  {#if member.profile_pic}
                    <img class="profilepic" src="/api/uploads/{member.profile_pic}" alt="{member.displayname}">
                  {/if}
                  <span class="membername">{member.displayname}</span>
                </div>
                <div class="actions">
                  <IconButton bg={3} label="Pardon" path="M10 2L9 1L3 7L1 5L0 6L3 9Z" viewBox="0 0 10 10" onclick={() => unban(member.username)} />
                </div>
              </li>
            {/each}
          {/if}
          <li class="new">
            <div class="baninput">
              <input type="text" bind:value={newBan}>
              <div class="outersuggestions">
                <div class="suggestions">
                  {#each sortMembers(newBan).slice(0,10) as member}
                    <button class="suggestion" onclick={() => newBan = member.username}>
                      {member.displayname}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
            <IconButton red viewBox="0 0 20 20" path="M1 17L8 10L5 7L9 3L17 11L13 15L10 12L3 19Z M8 20L10 18L18 18L20 20Z" label="Ban member" onclick={() => ban(newBan) } />
          </li>
        </ul>
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
  .administrators, .bannedmembers {
    list-style: none;
    display: flex;
    flex-direction: column;

    margin: 0;
    padding: 0;

    &>li {
      height: 2.75rem;
      display: flex;
      flex-direction: row;
      gap: .5rem;
      align-items: center;
      padding: .5rem;
      border-radius: .5rem;

      justify-content: space-between;

      &:nth-child(odd) {
        background-color: var(--bg3);
      }
      
      &>.name {
        display: flex;
        flex-direction: row;
        gap: .5rem;
        align-items: center;

        >img {
          height: 2.5rem;
          width: 2.5rem;
          object-fit: cover;
          border-radius: 100%;
          border: .125rem solid var(--emphasis);
        }
      }

      &>.actions {
        display: flex;
        flex-direction: row;
        gap: .5rem;
        align-items: center;
      }
    }

    &>.add {
      height: 3.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      padding: .5rem;

      border-radius: .5rem;

      &:nth-child(odd) {
        background-color: var(--bg3);
      }

      &:hover, &:active, &:focus-visible {
        &>svg>path {
          fill: var(--bg1);
        }
      }

      &>svg {
        width: 1.5rem;
        height: 1.5rem;

        &>path {
          fill: var(--emphasis);
        }
      }
    }

    &>.new {

      &:nth-child(odd) {
        & input { background-color: var(--bg4); }
      }

      &:nth-child(even) {
        & input { background-color: var(--bg3); }
      }

      &>.admininput, &>.baninput {
        display: flex;
        flex: 1;
        flex-direction: column;

        &>input {
          border: none;
          border-radius: .5rem;
          height: 2rem;
        }

        &>.outersuggestions {
          height: 0;
          position: relative;
          display: none;

          &>.suggestions {
            box-sizing: border-box;
            padding: .5rem;
            border-radius: .5rem;
            width: 100%;
            max-height: 10rem;
            overflow-y: auto;
            background-color: var(--bg2);
            position: absolute;
            display: flex;
            flex-direction: column;

            &>.suggestion {
              padding: .5rem;
              height: 3rem;
              box-sizing: border-box;
              border: none;
              border-radius: .5rem;
            }
          }
        }

        &>input:focus+.outersuggestions, &>.outersuggestions:hover {
          display: block;
        }
      }
    }

    &>.emptylist {
      height: 2.75rem;
      padding: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-style: italic;
      color: var(--emphasis);
    }
  }
</style>