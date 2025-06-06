<script lang="ts">
  import { goto } from "$app/navigation";
  import { sortMembers } from "$lib/members";
  import type { frontendclient, game } from "$lib/types";
  import IconButton from "../iconButton.svelte";

  let { bannedmembers, members, game: gameobj, error }: {bannedmembers: (frontendclient & {banned: boolean, admin: boolean})[], members: (frontendclient & {banned: boolean, admin: boolean})[], game: game, error: string} = $props()

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
        game: gameobj.url_id,
        username
      })
    });

    // Redirect if the user is unauthorized
    if (resp.status == 403) await goto(`/game/${gameobj.url_id}`);
    if (!resp.ok) {
      // Show error message
      error = (await resp.json()).message;
      // Revert to backup
      bannedmembers = bannedbackup;
    }
  }

  async function ban(username: string) {
    // Backup and add to banned list
    const bannedbackup = $state.snapshot(bannedmembers);
    const member = members.find(m => m.username == username);
    if (!member) return;
    bannedmembers.push(member);
    bannedmembers = bannedmembers;
    
    // Send POST request
    const resp = await fetch('/api/game/ban', {
      method: 'POST',
      body: JSON.stringify({ game: gameobj.url_id, target: username })
    });
    
    // Redirect to the game page if the client is unauthorized
    if (resp.status == 403) await goto(`/game/${gameobj.url_id}`);
    if (!resp.ok) {
      // Revert to the old banned members
      bannedmembers = bannedbackup;
      // Show the error message
      error = (await resp.json()).message;
    }
  }
</script>

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
          {#each sortMembers(newBan, $state.snapshot(members)).slice(0,10) as member}
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

<style>
  .bannedmembers {
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

    &>.new {

      &:nth-child(odd) {
        & input { background-color: var(--bg4); }
      }

      &:nth-child(even) {
        & input { background-color: var(--bg3); }
      }

      &>.baninput {
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