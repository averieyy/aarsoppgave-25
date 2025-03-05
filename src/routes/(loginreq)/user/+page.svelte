<script>
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  let { client } = $state(data);
  let { username } = $state(client);
  let { username: lastsavedusername} = $state(client);

  async function save () {
    const resp = await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
    if (!resp.ok) {
      // Display an error message
    }
    else {
      lastsavedusername = username;
      return;
    }
  }
</script>

<svelte:head>
  <title>Speedrun - User settings</title>
</svelte:head>

<div class="page">
  <Header client={client} />
  <main class="innerpage">
    <section>
      <h2>Settings</h2>
      <input type="text" placeholder="Username" bind:value={username}>
    </section>
    <a href="/newgame" class="button">Create new game</a>
    <div class="bottom">
      <div class="outerbutton">
        <button onclick={() => save()} class="save red {username == lastsavedusername ? 'hidden' : 'shown'}">Unsaved Changes</button>
      </div>
    </div>
  </main>
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
</style>