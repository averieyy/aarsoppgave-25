<script lang="ts">
  const { url, mime}: { url: string, mime: string } = $props();
</script>


{#if mime.startsWith('video')}
  <video>
    <source src="/api/uploads/{url}" type="{mime}">
    <track kind="captions">
  </video>
{:else if mime.startsWith('image')}
  <img src="/api/uploads/{url}" alt="Proof for speedrun">
{/if}

<style>
  img, video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>