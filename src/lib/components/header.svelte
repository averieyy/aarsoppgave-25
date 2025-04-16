<script lang="ts">
  import { page } from "$app/state";
  import type { frontendclient } from "$lib/types";

  const { client }: { client: undefined | frontendclient } = $props();
</script>

<header>
  <nav>
    <a class="rootlink" href="/">
      <h1>Speedrun</h1>
    </a>
    <span class="sep smallhidden"></span>
    <a class="smallhidden navbutton" href="/about">About</a>
    <a class="smallhidden navbutton" href="/games">Games</a>
  </nav>
  <div class="client">
    {#if client}
      <a href="/user" class="button {client.profile_pic ? 'withprofilepic' : 'withoutprofilepic'}">
        {#if client.profile_pic}
          <img src="/api/uploads/{client.profile_pic}" title="My page" alt="My page">
        {:else}
          My page
        {/if}
      </a>
    {:else}
      <a href="/login?redirect={page.url.pathname}" class="button">Login</a>
      <a href="/register?redirect={page.url.pathname}" class="button">Register</a>
    {/if}
  </div>
</header>

<style>
  @media screen and (max-width: 500px) {
    .smallhidden {
      display: none !important;
    }
  }

  .withprofilepic {
    height: 3rem;
    width: 3rem;
    overflow: hidden;
    border-radius: 100%;
    padding: 0;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
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
    margin: .5rem;

    &:hover, &:active {
      & h1 {
        border-bottom-width: .25rem;
      }
    }
  }
  nav {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    align-items: center;
  }
  .sep {
    width: .125rem;
    margin: .5rem;
    height: 1.5rem;
    background-color: var(--emphasis);
  }
  .navbutton {
    text-decoration: none;
    padding: .5rem;
    box-sizing: border-box;
    height: 2.5rem;

    display: flex;
    align-items: center;

    background-color: var(--bg2);
    
    &:hover, &:active, &:focus {
      background-color: var(--bg3);
    }
  }
</style>