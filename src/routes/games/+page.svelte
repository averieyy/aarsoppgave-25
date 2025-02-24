<script lang="ts">
  import Gamelist from "$lib/components/gamelist.svelte";
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  
  let { client, games } = $state(data);
</script>

<svelte:head>
  <title>Speedrun - Games list</title>
</svelte:head>

<div class="page">
  <Header client={client}/>
  <div class="innerpage">
    <main>
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
  }
</style>