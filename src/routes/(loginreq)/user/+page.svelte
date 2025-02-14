<script>
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  let { client } = $state(data);

</script>

<div class="page">
  <Header client={client} />
  <main class="innerpage">

  </main>
</div>