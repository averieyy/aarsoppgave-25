<script lang="ts">
  import Header from "$lib/components/header.svelte";

  const { data } = $props();
</script>

<div class="page">
  <Header client={data.client}/>
  <div class="innerpage">
    <main>
      <section id="about">
        <h1>About speedrun</h1>
        <p>Speedrun is an online speedrunning community. You can register games and the fight for the best time. The only way to go is fast! It's all about getting to the top of the leaderboards and stay there for as long as possible.</p>
      </section>
      <section id="FAQ">
        <h2>FAQ</h2>
      </section>
    </main>
  </div>
</div>

<style>
  .innerpage {
    align-items: center;
  }
  main {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 750px;
    gap: 1rem;

    * {
      background-color: var(--bg2);
      padding: .5rem;
      border-radius: .5rem;
    }
  }
</style>