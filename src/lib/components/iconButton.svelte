<script lang="ts">
  const { label='', onclick, path, bg=1, viewBox="0 0 10 10", red=false }: { label: string, onclick?: () => void, path: string, bg?: 0 | 1 | 2 | 3, viewBox?: string, red?: boolean } = $props();
</script>

<button aria-label={label} onclick={() => onclick && onclick()}
  class="{bg == 0 ? 'bg1' : bg == 1 ? 'bg2' : bg == 2 ? 'bg3' : 'bg4'} {red ? 'red' : ''}">
  <svg viewBox={viewBox}>
    <path d={path}
    ></path>
  </svg>
</button>

<style>
  button {
    width: 2rem;
    height: 2rem;
    padding: .5rem;
    box-sizing: border-box;
    border: none;
    border-radius: .5rem;

    &:hover, &:focus-visible, &:active {
      &:not(:active) {
        &.red {
          background-color: var(--red);
        }
        background-color: var(--emphasis);
      }
      
      &:active {
        &.red {
          background-color: var(--red);
        }
        background-color: var(--emphasis-dark);
      }

      & path {
        fill: var(--bg1);
      }
    }

    & path {
      fill: var(--emphasis);
      fill-rule: evenodd;
    }

    &.bg1 { background-color: var(--bg1); }
    &.bg2 { background-color: var(--bg2); }
    &.bg3 { background-color: var(--bg3); }
    &.bg4 { background-color: var(--bg4); }
  }
</style>