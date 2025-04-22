<script lang="ts">
    import { goto } from "$app/navigation";
  import Header from "$lib/components/header.svelte";
  import Timeinput from "$lib/components/timeinput.svelte";
    import { handleForm } from "$lib/forms.js";

  const { data } = $props();

  let { game, client } = $state(data);

  let time = $state(0);
  let description = $state('');

  let error: string = $state('');

  async function submit() {
    const resp = await fetch('/api/game/submit', {
      method: 'POST',
      body: JSON.stringify({ game_id: game?.id, duration: time, description })
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
  <main class="innerpage">
    <form onsubmit={ev => handleForm(ev, submit)}>
      <Timeinput bind:value={time}></Timeinput>
      <textarea class="input" bind:value={description}></textarea>
      <input type="submit" value="Register run" />
    </form>
  </main>
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
</style>
