<script lang="ts">
  let { value = $bindable(0) }: { value: number } = $props();

  let milliseconds = $state('000');
  let seconds = $state('00');
  let minutes = $state('00');
  let hours = $state('00');

  // Turn hours, minutes, seconds and milliseconds into milliseconds
  function toMilliseconds(): number {
    const nmilliseconds = Math.min(Math.max(parseInt(milliseconds), 0), 999);
    const nseconds = Math.min(Math.max(parseInt(seconds), 0), 59);
    const nminutes = Math.min(Math.max(parseInt(minutes), 0), 59);
    const nhours = Math.max(parseInt(hours), 0);

    return nmilliseconds
      + nseconds * 1000
      + nminutes * 60000
      + nhours * 3600000;
  }

  // Update the millisecond total when any of the individual values get updated
  $effect(() => {
    milliseconds;
    seconds;
    minutes;
    hours;

    value = toMilliseconds();
  });
</script> 

<div class="timeinput">
  <input type="text" class="hours" bind:value={hours} placeholder="00">
  <span class="sep">:</span>
  <input type="text" bind:value={minutes} placeholder="00">
  <span class="sep">:</span>
  <input type="text" bind:value={seconds} placeholder="00">
  <span class="sep">.</span>
  <input type="text" class="mills" bind:value={milliseconds} placeholder="000">
</div>

<style>
  .timeinput {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
  }
  .timeinput>input {
    width: 2rem;
    text-align: center;
    padding: .25rem;
    height: 2rem;
    border: none;

    &.mills, &.hours {
      width: 3rem;
    }
  }
</style>