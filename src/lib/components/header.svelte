<script lang="ts">
  import { page } from "$app/state";
  import type { frontendclient } from "$lib/types";

  const { client }: { client: undefined | frontendclient } = $props();

  const pages: {url: string, display: string}[] = [
    {
      display: 'About',
      url: '/about'
    },
    {
      display: 'Games',
      url: '/games'
    }
  ];

  let currenturl = $state(page.url.pathname);
</script>

<header>
  <nav>
    <a class="rootlink" href="/">
      <h1>Speedrun</h1>
    </a>
    <span class="sep smallhidden"></span>
    {#each pages as page}
      <a class="smallhidden navbutton" href="{page.url}">
        <span class="display">
          {page.display}
        </span>
        <span class="underline {currenturl == page.url ? 'selected' : 'unselected'}"></span>
      </a>      
    {/each}
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

    display: flex;
    align-items: center;
    flex-direction: column;

    
    &:hover, &:active, &:focus {
      &>.display {
        background-color: var(--bg3);
      }
      &>.underline {
        width: 2rem;
      }
    }
    
    &>.display {
      padding: .5rem;
      box-sizing: border-box;
      height: 2.5rem;
      
      border-radius: .25rem;
      background-color: var(--bg2);
      display: flex;
      align-items: center;
    }

    &>.underline {
      height: .125rem;
      width: 0rem;
      border-radius: .125rem;
      background-color: var(--emphasis);
      
      transition: width .25s ease;
      
      &.selected {
        width: 2rem;
      }
    }
  }
</style>