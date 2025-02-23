<script lang="ts">
  const { speedruns }: { speedruns: {score: number, username: string, submitted: Date }[] } = $props();

  function toTime(score: number): string {
    return `${score > 3600000 ? Math.floor(score / 3600000) + ':' : ''}${(Math.floor(score / 60000) % 60).toString().padStart(2, '0')}:${(Math.floor(score / 1000) % 60).toString().padStart(2, '0')}`
  }
  function toTimeSince(date: Date): string {
    const numeric = Date.now() - date.getTime();

    if (numeric < 3600000)
      return 'Just now'; // Less than an hour
    if (numeric < 1000 * 60 * 60 * 24)
      return `${Math.floor(numeric / 3600000)} hours ago`; // Less than a day 
    if (numeric < 1000 * 60 * 60 * 24 * 7)
      return `${Math.floor(numeric / (1000 * 60 * 60 * 24))} days ago`; // Less than a week
    if (numeric < 1000 * 60 * 60 * 24 * 30)
      return `${Math.floor(numeric / (1000 * 60 * 60 * 24 * 7))} weeks ago` // Less than a month
    if (numeric < 1000 * 60 * 60 * 24 * 365)
      return `${Math.floor(numeric / (1000 * 60 * 60 * 24 * 30))} months ago` // Less than a year
    else return `${Math.floor(numeric / (1000 * 60 * 60 * 24 * 365))} years ago` // Years
  }
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
    width: 5rem;
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