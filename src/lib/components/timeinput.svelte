<script lang="ts">
  let writtenvalue = $state('');
  let input: HTMLInputElement | undefined = $state();

  let { value = $bindable(0) }: { value: number } = $props();

  let milliseconds = $state('000');
  let seconds = $state('00');
  let minutes = $state('00');
  let hours = $state('00');

  function toMilliseconds(time: string): number {
    milliseconds = time.slice(-3).padStart(3,'0');
    seconds = time.slice(-5,-3).padStart(2,'0');
    minutes = time.slice(-7,-5).padStart(2,'0');
    hours = time.slice(0,-7).padStart(2,'0');

    return parseInt(milliseconds)
      + parseInt(seconds) * 1000
      + parseInt(minutes) * 60000
      + parseInt(hours) * 3600000;
  }

  $effect(() => {
    writtenvalue;

    if (writtenvalue.match(/[^0-9]/)) writtenvalue = writtenvalue.replaceAll(/[^0-9]/g, '');

    value = toMilliseconds(writtenvalue);
  });
</script>

<div class="timeinput input">
  <input type="text" accept="[0-9]*" bind:this={input} bind:value={writtenvalue}>
  <span>{hours}</span>
  <span class="sep">:</span>
  <span>{minutes}</span>
  <span class="sep">:</span>
  <span>{seconds}</span>
  <span class="sep">.</span>
  <span>{milliseconds}</span>
</div>

<style>
  .timeinput {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .timeinput>span {
    font-family: var(--monospaced);
  }
</style>