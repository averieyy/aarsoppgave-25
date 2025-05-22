<script lang="ts">
    import { goto } from "$app/navigation";
  import Header from "$lib/components/header.svelte";
  import { handleForm } from "$lib/forms.js";

  const { data } = $props();
  let { client } = $state(data);

  // State variables for the new game
  let title: string = $state('');
  let description: string = $state('');

  // Tags
  let tags: string[] = $state([]);
  let newTagContent: string = $state('');
  
  // Categories
  let categories: string[] = $state(['any%']);
  let newCategoryContent: string = $state('');

  // The error value shown on the page
  let error: string = $state('');

  // Remove tag
  function removeTag (tag: string) {
    // Get the index
    const index = tags.indexOf(tag);
    if (index == -1) return;
    // Remove the tag
    tags.splice(index,1);
    // Reload
    tags = tags;
  }

  // Add tag
  function addTag () {
    if (!newTagContent) return;
    tags.push(newTagContent);
    // Clear the input feild
    newTagContent = '';
    // Reload the display
    tags = tags;
  }

  // Remove category from the game
  function removeCategory (category: string) {
    // You have to have at least one category
    if (categories.length == 1) {
      error = 'You have to have at least one category';
      return;
    }
    // Get the index of the category
    const index = categories.indexOf(category);
    if (index == -1) return;
    // Remove it
    categories.splice(index, 1);
    // Reload the display
    categories = categories;
  }

  // Add category from the game
  function addCategory () {
    if (!newCategoryContent) return;
    categories.push(newCategoryContent);
    // Clear the input feild
    newCategoryContent = '';
    // Reload the categories display
    categories = categories;
  }

  // Create the game with the tags, title, description and categories
  async function submit () {
    const resp = await fetch('/api/game/create', {
      method: 'POST',
      body: JSON.stringify({
        tags,
        title,
        description,
        categories,
      }),
    });

    // If there is any error, show the error message
    if (!resp.ok) {
      const { message } = await resp.json();
      error = message;
    }
    else {
      // Redirect to the game page
      const { url_id } = await resp.json();
      goto(`/game/${url_id}`);
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
      <h3>Categories</h3>
      {#if categories.length > 0}
        <div class="categories">
          {#each categories as category}
            <div class="category">
              <span class="content">{category}</span>
              <button class="remove" onclick={() => removeCategory(category)}>x</button>
            </div>
          {/each}
        </div>
      {/if}
      <div class="outeradd">
        <form onsubmit={ev => handleForm(ev, addCategory)} class="add category">
          <input type="text" bind:value={newCategoryContent} placeholder="category">
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
  .tags, .categories {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: .5rem;
  }
  .tag, .category {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: .5rem;

    &.tag::before {
      content: '#';
    }

    &.category::before {
      content: '/';
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