<script lang="ts">
  import { toTimeSince, toTime } from '$lib/timedisplay';
  
  const { speedruns, categories }: { speedruns: {score: number, username: string, submitted: Date, id: number, profile_pic?: string | null, category_label: string }[], categories: string[] } = $props();

  let selectedCategory = $state(categories[0]);

  let filteredSpeedruns = $derived(speedruns.filter(s => s.category_label == selectedCategory));

</script>

<div class="speedruns">
  <div class="categories">
    {#each categories as category}
      <button onclick={() => selectedCategory = category} class="category {selectedCategory == category ? 'selected' : ''}">{category}</button>
    {/each}
  </div>
  {#if filteredSpeedruns.length == 0}
    <span class="nospeedruns">No speedruns in this category yet. Submit one!</span>
  {:else}
    {#each filteredSpeedruns as speedrun}
      <a href="/speedrun/{speedrun.id}" class="speedrun">
        <div class="time">
          <span class="fulltime">{toTime(speedrun.score)}</span>
          <span class="mills">.{(speedrun.score % 1000).toString().padStart(3, '0')}</span>
        </div>
        <div class="namesubmitted">
          {#if speedrun.profile_pic}
            <img class="profile_pic" src="/api/uploads/{speedrun.profile_pic}" alt="{speedrun.username}">
          {:else}
            <span class="name">
              {speedrun.username}
            </span>
          {/if}
          <span class="submitted">
            {toTimeSince(speedrun.submitted)}
          </span>
        </div>
      </a>
    {/each}
  {/if}
</div>

<style>
  .speedruns {
    display: flex;
    flex-direction: column;
  }
  .speedrun {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 3rem;
    padding: 0 .5rem;
    justify-content: space-between;
    text-decoration: none;

    &:nth-child(even) {
      background-color: var(--bg3);
    }
    &:nth-child(odd) {
      background-color: var(--bg2);
    }

    &:hover, &:active {
      & .mills {
        max-width: 2rem;
      }
      & .submitted {
        max-width: 6rem;
        margin-left: .5rem;
      }
    }
  }
  .time {
    display: flex;
    flex-direction: row;
    gap: 0;
    height: 3rem;
    align-items: center;
    overflow: hidden;

    &>.mills {
      max-width: 0rem;
      overflow: hidden;
      transition: max-width .25s ease;
    }
  }
  .namesubmitted {
    display: flex;
    flex-direction: row;
    align-items: center;

    &>.submitted {
      max-width: 0;
      overflow: hidden;
      text-wrap: nowrap;
      transition: max-width .25s ease, margin-left .25s ease;
      margin-left: 0;
    }
  }
  .profile_pic {
    width: 2rem;
    height: 2rem;
    object-fit: cover;
    border: .125rem solid var(--emphasis);
    border-radius: 50%;
  }
  .categories {
    display: flex;
    flex-direction: row;
    background-color: var(--bg2);
    overflow: auto;
  }
  .category {
    border: none;
    border-bottom: .125rem solid var(--bg2);
    background-color: var(--bg2);
    color: inherit;

    &.selected, &:hover, &:focus-visible {
      border-color: var(--emphasis);
      color: inherit;
      background-color: var(--bg3);
    }

    &:active {
      background-color: var(--bg2);
      color: inherit;
      border-color: var(--emphasis-dark);
    }
  }
  .nospeedruns {
    text-align: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    display: flex;
  }
</style>