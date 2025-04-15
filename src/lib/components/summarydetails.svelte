<script lang="ts">
  import type { Snippet } from "svelte";

  let { summary, children }: { summary: string, children: Snippet } = $props();

  let open: boolean = $state(false);

</script>

<div class="main">
  <button class="summary" onclick={() => open = !open}>
    <span class="shownindicator {open ? 'open' : 'closed'}"></span>
    <span class="summarycontent">
      {summary}
    </span>
  </button>
  <div class="content {open ? 'open' : 'closed'}" hidden={!open}>
    {@render children()}
  </div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    border-radius: .5rem;
    background-color: var(--bg2);
  }
  .summary {
    border: none;
    background-color: var(--bg3);
    border-radius: .5rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    &:hover, &:active, &:focus {
      background-color: var(--bg3);
      color: var(--fg1);
    }
  }
  .summarycontent {
    flex: 1;
  }
  .shownindicator {
    width: 1rem;
    height: 1rem;
    background-color: var(--fg1);
    clip-path: polygon(12.5% 19.75%, 0% 31.25%, 50% 81.25%, 100% 31.25%, 86.5% 19.75%, 50% 62.5%);
    transition: rotate .25s ease;
    margin: .5rem;
    
    &.open {
      rotate: 0deg;
    }
    &.closed {
      rotate: -90deg;
    }
  }
  .content {
    padding: .5rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    
    &.closed {
      display: none;
    }
  }
</style>