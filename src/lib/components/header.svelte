<script lang="ts">
  const { client }: { client: undefined | object } = $props();
</script>

<header>
  <h1>Speedrun</h1>
  <div class="client">
    {#if client}
      <a href="/user" class="button">My page</a>
    {:else}
      <a href="/login" class="button">Login</a>
      <a href="/register" class="button">Register</a>
    {/if}
  </div>
</header>

<style>
  header {
    background-color: var(--bg2);
    height: 5rem;
    display: flex;
    flex-direction: row;
    padding: 1rem;
    box-sizing: border-box;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
  }
  .client {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
</style>