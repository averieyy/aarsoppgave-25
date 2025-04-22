<script lang="ts">
  import Header from "$lib/components/header.svelte";
    import { handleForm } from "$lib/forms.js";

  const { data } = $props();
  let { client } = $state(data);

  let title: string = $state('');
  let description: string = $state('');
  let tags: string[] = $state([]);
  let newTagContent: string = $state('');

  let error: string = $state('');

  function removeTag (tag: string) {
    const index = tags.indexOf(tag);
    if (index == -1) return;
    tags.splice(index,1);
    tags = tags;
  }

  function addTag () {
    if (!newTagContent) return;
    tags.push(newTagContent);
    newTagContent = '';
    tags = tags;
  }

  async function submit () {
    const resp = await fetch('/api/game/create', {
      method: 'POST',
      body: JSON.stringify({
        tags,
        title,
        description,
      }),
    });

    if (!resp.ok) {
      const { message } = await resp.json();
      error = message;
    }
  }
</script>

<svelte:head>
  <title>Speedrun - Add new game</title>
</svelte:head>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main class="centered">
      {#if error}
        <span class="error">{error}</span>
      {/if}
      <input bind:value={title} type="text" placeholder="Title">
      <textarea bind:value={description} class="input" placeholder="Description" rows="4"></textarea>
      <h3>Tags</h3>
      {#if tags.length > 0}
        <div class="tags">
          {#each tags as tag}
            <div class="tag">
              <span class="content">{tag}</span>
              <button class="remove" onclick={() => removeTag(tag)}>x</button>
            </div>
          {/each}
        </div>
      {/if}
      <div class="outeradd">
        <form onsubmit={ev => handleForm(ev, addTag)} class="add tag">
          <input type="text" bind:value={newTagContent} placeholder="tag">
        </form>
      </div>
      <button onclick={submit}>Confirm</button>
    </main>
  </div>
</div>

<style>
  textarea {
    resize: vertical;
    min-height: 5rem;
    padding: 1rem .5rem;
  }
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: .5rem;
  }
  .tag {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: .5rem;

    &::before {
      content: '#';
    }

    box-sizing: border-box;
    height: 3rem;
    padding: .5rem;
    
    font-size: .9rem;
    user-select: none;
    cursor: default;
    
    border: .125rem solid var(--emphasis);
    background-color: var(--bg2);

    &>.content {
      color: var(--fg);
    }

    color: var(--fg);

    &>.remove {
      height: 1.75rem;
      width: 1.75rem;
      border: none;
    }
  }
  .add {
    &::before {
      padding: .5rem;
    }
    padding: 0rem;
    gap: 0;
    &>input {
      border: none;
      height: 100%;
      background-color: var(--bg3);
      outline: none;
    }
    &:hover, &:active {
      border: .125rem solid var(--emphasis);
      background-color: var(--emphasis);
      &::before {
        color: var(--fg-emphasis);
      }
    }
  }
  .outeradd {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>