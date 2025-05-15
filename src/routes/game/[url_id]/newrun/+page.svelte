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
    const cat = categories.find(c => c.id == selectedCategory);
    
    if (!proof && cat!.require_proof) {
      error = 'Proof is required';
      return;
    }
    if (proof && !(new RegExp(cat!.proof_match).test(proof!.type))) {
      error = 'Proof does not have the correct type';
      return;
    }

    let proof_id = await uploadProof();

    const resp = await fetch('/api/game/submit', {
      method: 'POST',
      body: JSON.stringify({
        game_id: game?.id,
        duration: time,
        description,
        category: selectedCategory,
        proof: proof_id
      })
    });

    if (!resp.ok) {
      const { message } = await resp.json();

      error = message;
    }
    else goto(`/game/${game?.url_id}`);
  }

  async function uploadProof (): Promise<string | undefined> {
    const formdata = new FormData();
    if (!proof) return;

    formdata.set('file', proof);

    const file = await fetch('/api/upload', { method: 'POST', body: formdata });
  
    if (!file.ok) return undefined;
    
    return (await file.json()).id;
  }

  let prooflist: FileList | undefined = $state();
  let proof = $derived(prooflist && prooflist.length > 0 ? prooflist.item(0) : undefined)
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
              {category.category_label}
          </button>
        {/each}
      </div>
      <form onsubmit={ev => handleForm(ev, submit)}>
        <Timeinput bind:value={time}></Timeinput>
        <textarea class="input" bind:value={description} placeholder="Description"></textarea>
        <h2>Proof</h2>
        <label>
          <div class="proofinput">
            {#if proof}
              <svg viewBox="0 0 10 10">
                <path
                  d="M2 1L6 1L8 3L8 9L2 9Z M3 3L7 3L7 4L3 4Z M3 5L7 5L7 6L3 6Z M3 7L7 7L7 8L3 8Z">
                </path>
              </svg>
              <span>{proof.name}</span>
            {:else}
              <svg viewBox="0 0 10 10">  
                <path
                  d="M4 1L6 1L6 4L9 4L9 6L6 6L6 9L4 9L4 6L1 6L1 4L4 4Z">
                </path>
              </svg>
              <span>Select file for proof</span>
            {/if}
          </div>
          <input hidden bind:files={prooflist} max="1" type="file">
        </label>
        {#if error}
          <span class="error">{error}</span>
        {/if}
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
  .proofinput {
    height: 3rem;
    border: .125rem solid var(--emphasis);
    background-color: var(--bg2);
    display: flex;
    flex-direction: row;
    padding: .5rem;
    gap: .5rem;
    box-sizing: border-box;
    align-items: center;

    &>span {
      flex: 1;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &>svg {
      width: 2rem;
      height: 2rem;
      
      &>path {
        fill: var(--emphasis);
        fill-rule: evenodd;
      }
    }
  }
</style>
