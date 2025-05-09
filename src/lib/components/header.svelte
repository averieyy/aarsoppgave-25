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

  let phonenavshown = $state(false);

  let phonenavheight = $state(0);
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
  <div class="right">
    <div class="client smallhidden">
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
    <button class="hamburger {phonenavshown ? 'navshown' : ''}" onclick={() => phonenavshown = !phonenavshown} aria-label="Show navigation menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</header>
<div class="phonenav {phonenavshown ? 'shown' : 'hidden'}" aria-hidden={!phonenavshown} style="height: {phonenavheight}px;">
  <nav bind:clientHeight={phonenavheight}>
    {#each pages as page}
      <a href={page.url} class="phonenavbutton">
        <span class="display">
          {page.display}
        </span>
        <span class="underline {currenturl == page.url ? 'selected' : 'unselected'}"></span>
      </a>
    {/each}
    <span class="sep"></span>
    {#if client}
      <a href="/user" class="phoneuser">
        <span class="display">{client.displayname}</span>
        {#if client.profile_pic}
          <img src="/api/uploads/{client.profile_pic}" title="My page" alt="Profile pic">
        {/if}
      </a>
      {:else}
        <a href="/login?redirect={page.url.pathname}" class="phonenavbutton">
          <span class="display">
            Log in
          </span>
        </a>
        <a href="/register?redirect={page.url.pathname}" class="phonenavbutton">
          <span class="display">
            Register
          </span>
        </a>
      {/if}
  </nav>
</div>

<style>
  @media screen and (max-width: 500px) {
    .smallhidden {
      display: none !important;
    }
    .hamburger {
      display: flex !important;
    }
    .phonenav {
      display: flex !important;
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
  .right {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    align-items: center;
  }
  .hamburger {
    border: none;
    padding: .5rem;
    width: 2.75rem;
    height: 2.75rem;

    border-radius: .25rem;

    display: none;
    flex-direction: column;
    justify-content: space-around;
    background-color: var(--bg3);

    &:hover,&:focus-visible,&:active {
      &>span {
        background-color: var(--fg-emphasis);
      }
    }
    
    &>span {
      height: .25rem;
      display: flex;
      background-color: var(--fg1);
      width: 100%;

      rotate: 0;
      translate: 0;
      transition: rotate .25s ease, height .25s ease, translate .25s ease;
    }

    &.navshown {
      &>:nth-child(1) {
        rotate: 45deg;
        translate: 0 220%;
      }
      &>:nth-child(2) {
        height: 0;
      }
      &>:nth-child(3) {
        rotate: -45deg;
        translate: 0 -220%;
      }
    }
  }
  .phonenav {
    overflow: hidden;

    transition: height .25s ease;

    &.hidden {
      height: 0 !important;
    }
    display: none;

    &>nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .5rem;
      padding: .5rem;
      width: 100%;
      height: fit-content;

      &>.sep {
        height: .125rem;
        width: 30%;
        background-color: var(--emphasis);
        margin: 0;
        border-radius: .125rem;
      }
    }
  }
  .phonenavbutton {
    height: 2.5rem;
    display: flex;
    text-decoration: none;
    width: 100%;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;

    &>.display {
      padding: .5rem;
      box-sizing: border-box;

      flex: 1;
      width: 100%;
      
      border-radius: .25rem;
      background-color: var(--bg2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:hover, &:active, &:focus-visible {
      &>.underline {
        width: 3rem;
      }
    }

    &>.underline {
      height: .125rem;
      width: 0rem;
      border-radius: .125rem;
      background-color: var(--emphasis);
      
      transition: width .25s ease;
      
      &.selected {
        width: 3rem;
      }
    }
  }
  .phoneuser {
    height: 2.5rem;
    width: 100%;
    
    display: flex;
    align-items: center;
    flex-direction: row;

    border-radius: 1.5rem;
    background-color: var(--bg2);
    text-decoration: none;
    
    &>.display {
      flex: 1;
      text-decoration: none;
      padding: .5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &>img {
      height: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      box-sizing: border-box;
      border-radius: 50%;
      border: .125rem solid var(--emphasis);
    }
  }
</style>