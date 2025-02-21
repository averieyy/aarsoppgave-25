<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import Timeinput from "$lib/components/timeinput.svelte";

  const { data } = $props();

  let { game, client } = $state(data);

  let time = $state(0);
</script>

<svelte:head>
  <title>Speedrun - Register new run</title>
</svelte:head>

<div class="page">
  <Header {client} />
  <main class="innerpage">
    <form>
      <Timeinput bind:value={time}></Timeinput>
      <textarea class="input"></textarea>
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
