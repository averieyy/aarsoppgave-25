<script lang="ts">
    import Header from "$lib/components/header.svelte";
    import { toTimeSince } from "$lib/timedisplay";

  const { data } = $props();
  let { client, user } = $state(data);
</script>

<div class="page">
  <Header client={client} />
  <div class="innerpage">
    <main>
      <section class="titlesection">
        <h2><span class="emphasis">{user.username}'{user.username.endsWith('s') ? '' : 's'}</span> user page</h2>
        <span class="joined">Joined {toTimeSince(user.joined)}</span>
      </section>
    </main>
  </div>
</div>

<style>
  .emphasis {
    color: var(--emphasis);
  }
  section {
    padding: 1rem;
    background-color: var(--bg2);
    border-radius: .5rem;
  }
  .innerpage {
    align-items: center;
  }
  main {
    width: 750px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  h2 {
    padding: .5rem;
    border-bottom: .125rem solid var(--emphasis);
    border-radius: .125rem;
  }
  .titlesection {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .joined {
    font-style: italic;
  }
</style>