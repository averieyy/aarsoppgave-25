<script lang="ts">
  import Gamelist from "$lib/components/gamelist.svelte";
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  
  let { client, games, tags } = $state(data);

  let error: string = $state('');

  let query: string = $state('');
  let selectedtags: string[] = $state([]);

  function selectTag(tag: string) {
    if (!selectedtags.includes(tag))
      selectedtags.push(tag);
    else
      selectedtags.splice(selectedtags.indexOf(tag), 1);
  }

  async function search () {
    const resp = await fetch(`/api/games?query=${query}&tags=${selectedtags.join(',')}`);

    if (!resp.ok) {

    }
  }
</script>

<svelte:head>
  <title>Speedrun - Games list</title>
</svelte:head>

<div class="page">
  <Header client={client}/>
  <div class="innerpage">
    <main>
      <div class="outersearch">
        <div class="searchbar">
          <input type="text" bind:value={query}>
          <button onclick={search}>Search</button>
        </div>
        <div class="tags">
          {#each tags as tag}
            <button onclick={() => selectTag(tag.tag)} class="no-button-style {selectedtags.includes(tag.tag) ? 'selected' : ''}">
              {tag.tag}
            </button>
          {/each}
        </div>
      </div>
      {#if error}
        <span class="error">{error}</span>
      {/if}
      <Gamelist games={games} />
    </main>
  </div>
</div>

<style>
  .innerpage {
    align-items: center;
  }
  main {
    width: 100%;
    box-sizing: border-box;
    max-width: 750px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .searchbar {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    &>input[type=text] {
      flex: 1;
    }
  }
  .outersearch {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .tags {
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
    
    &>* {
      height: 2.5rem;
      border-radius: 1rem;
      padding: .5rem;
      background-color: var(--bg2);
      border: .125rem solid var(--emphasis);

      &:hover {
        background-color: var(--emphasis-dark);
        border-color: var(--emphasis-dark);
        color: var(--bg1);
      }

      &.selected {
        background-color: var(--emphasis);
        color: var(--bg1);
        border-color: var(--emphasis);
      }
    }
  }
</style>