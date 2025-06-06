<script lang="ts">
  import { goto } from "$app/navigation";
  import { sortMembers } from "$lib/members";
  import type { frontendclient, game } from "$lib/types";
  import IconButton from "../iconButton.svelte";

  let { administrators, client, members, game: gameobj, error }: { administrators: (frontendclient & { banned: boolean, admin: boolean })[], client: frontendclient, members: (frontendclient & { banned: boolean, admin: boolean })[], game: game, error: string } = $props();

  // Whether the admin input feild is shown
  let editingNewAdmin: boolean = $state(false);
  // The current name in the add admin input feild
  let newAdmin: string = $state('');

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
        game: gameobj.url_id,
        target: newAdmin
      })
    });

    // Redirect if the user is unauthorized
    if (resp.status == 403) await goto(`/game/${gameobj.url_id}`);
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
        game: gameobj.url_id,
        target: admin
      })
    });
    
    // Redirect if the user is unauthorized
    if (resp.status == 403) await goto(`/game/${gameobj.url_id}`);
    // If it failed, revert to the backup and show error message
    if (!resp.ok) {
      administrators = adminsbackup;
      error = (await resp.json()).message;
    }
  }
</script>

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
            {#each sortMembers(newAdmin, $state.snapshot(members)) as member}
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

<style>

  .administrators {
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

      &>.admininput {
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
  }
</style>