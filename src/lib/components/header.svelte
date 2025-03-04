<script lang="ts">
  import { page } from "$app/state";

  const { client }: { client: undefined | object } = $props();
</script>

<header>
  <a class="rootlink" href="/">
    <h1>Speedrun</h1>
  </a>
  <div class="client">
    {#if client}
      <a href="/user" class="button">My page</a>
    {:else}
      <a href="/login?redirect={page.url.pathname}" class="button">Login</a>
      <a href="/register?redirect={page.url.pathname}" class="button">Register</a>
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
  h1 {
    border-image: linear-gradient(to left, var(--emphasis), var(--emphasis-dark)) 1;
    border-bottom: .125rem solid;
    transition: border-bottom-width .125s ease;
  }
  .rootlink {
    text-decoration: none;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    
    &:hover, &:active {
      &>h1 {
        border-bottom-width: .25rem;
      }
    }
  }
</style>