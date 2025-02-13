<script lang="ts">
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
  let { client } = $state(data);
</script>

<Header client={client}/>