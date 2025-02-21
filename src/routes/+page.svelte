<script lang="ts">
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  let { client } = $state(data);
</script>

<svelte:head>
  <title>Speedrun - Main page</title>
</svelte:head>

<div class="page">
  <Header client={client}/>
  <div class="innerpage">

  </div>
</div>