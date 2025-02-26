<script lang="ts">
  const { speedruns }: { speedruns: {score: number, username: string, submitted: Date }[] } = $props();

  import { toTimeSince, toTime } from '$lib/timedisplay';
</script>

<div class="speedruns">
  {#if speedruns.length == 0}
    <span>No speedruns yet. Be the first one!</span>
  {:else}
    {#each speedruns as speedrun}
      <div class="speedrun">
        <div class="time">
          <span class="fulltime">{toTime(speedrun.score)}</span>
          <span class="mills">.{(speedrun.score % 1000).toString().padStart(3, '0')}</span>
        </div>
        <div class="namesubmitted">
          <span class="name">
            {speedrun.username}
          </span>
          <span class="submitted">
            {toTimeSince(speedrun.submitted)}
          </span>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .speedrun {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 3rem;
    padding: 0 .5rem;
    justify-content: space-between;

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
    gap: .5rem;
    align-items: center;

    &>.submitted {
      max-width: 0;
      overflow: hidden;
      text-wrap: nowrap;
      transition: max-width .25s ease;
    }
  }
</style>