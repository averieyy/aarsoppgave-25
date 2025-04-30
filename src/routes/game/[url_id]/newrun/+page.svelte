<script lang="ts">
  import { goto } from "$app/navigation";
  import Header from "$lib/components/header.svelte";
  import Timeinput from "$lib/components/timeinput.svelte";
  import { handleForm } from "$lib/forms.js";

  const { data } = $props();

  let { game, client, categories } = $state(data);

  let time = $state(0);
  let description = $state('');

  let selectedCategory: number = $state(categories[0].id);

  let error: string = $state('');

  async function submit() {
    const resp = await fetch('/api/game/submit', {
      method: 'POST',
      body: JSON.stringify({
        game_id: game?.id,
        duration: time,
        description,
        category: selectedCategory
      })
    });

    if (!resp.ok) {
      const { message } = await resp.json();

      error = message;
    }
    else goto(`/game/${game?.url_id}`);
  }
</script>

<svelte:head>
  <title>Speedrun - Register new run</title>
</svelte:head>

<div class="page">
  <Header {client} />
  <div class="innerpage">
    <main class="centered">
      <div class="gameinfo">
        {#if game.image}
          <img src="/api/uploads/{game.image}" alt="{game.name}">
        {/if}
        <div class="gamenamedesc">
          <h1><a class="emphasis" href="/game/{game.url_id}">{game.name}</a></h1>
          <p>{game.description}</p>
        </div>
      </div>
      <div class="categories">
        {#each categories as category}
          <button
            class="category {selectedCategory == category.id ? 'selected' : ''}"
            onclick={() => selectedCategory = category.id}>
              {category.category_id}
          </button>
        {/each}
      </div>
      <form onsubmit={ev => handleForm(ev, submit)}>
        <Timeinput bind:value={time}></Timeinput>
        <textarea class="input" bind:value={description}></textarea>
        <input type="submit" value="Register run" />
      </form>
    </main>
  </div>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  textarea {
    resize: vertical;
    min-height: 4rem;
    max-height: 16rem;
    height: 8rem;
  }
  .centered {
    width: 750px;
    max-width: 100%;
  }
  a {
    text-decoration: none;
  }
  h1 {
    border-bottom: .125rem solid var(--emphasis);
  }
  .emphasis {
    color: var(--emphasis);
  }
  .gameinfo {
    display: flex;
    align-items: row;
    gap: .5rem;

    align-items: center;

    &>img {
      width: 5rem;
      height: 5rem;
      object-fit: cover;
      border-radius: .5rem;
      border: .125rem solid var(--emphasis);
    }
    &>.gamenamedesc {
      flex: 1;
      display: flex;
      flex-direction: column;

      gap: .25rem;

      &>p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .categories {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: .5rem;

    &>.category {
      &.selected {
        background-color: var(--emphasis);
        color: var(--bg1);
      }
    }
  }
</style>
