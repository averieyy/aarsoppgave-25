<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import Summarydetails from "$lib/components/summarydetails.svelte";

  const { data } = $props();
  const { client } = $state(data);
</script>

<div class="page">
  <Header client={client}/>
  <div class="innerpage">
    <main>
      <section id="about">
        <h1>About speedrun</h1>
        <p>Speedrun is an online speedrunning community. You can register games and the fight for the best time. The only way to go is fast! It's all about getting to the top of the leaderboards and stay there for as long as possible.</p>
      </section>
      <section id="FAQ">
        <h2>FAQ</h2>
        <Summarydetails summary="How do I create a game?">
          <p class="center">Creating a game should be quite easy. You really just need to create a profile, go into the user settings, and scroll down to the "Create game"-button.</p>
          <p class="center">Alternatively, you can use the button below.</p>
          <a href="/newgame" class="button">Create game</a>
        </Summarydetails>
        <Summarydetails summary="How do I submit a speedruns?">
          <p class="center">Go to the game's page. Under its description, click the button labelled "Submit run"</p>
          <p class="center">
            When you're on the page, input the time, choose your category and add a description.
            You can upload proof to help administrators validate your speedrun. For some categories, this will be required.
          </p>
          <p class="center">Click<i>Register run.</i>This will put your speedrun up for validation by an administrator.</p>
        </Summarydetails>
        <Summarydetails summary="How do I create a speedrun category?">
          <p class="center">Go the game page and click on the "Manage game" button. You will need to be logged in as a game administrator to do this.</p>
          <p class="center">You will see a list over the categories with some data on each category. Click on the button labelled "+" at the bottom of this list.</p>
          <p class="center">A new element will added to the list. There, you can edit its name and proof details. The name has to be unique.</p>
          <p class="center">The checkbox controls whether proof is required to submit a speedrun in the category. The type constraint will be upheld no matter if proof is required or not. To create a type other than video, audio or image, you can choose "Custom", and type in a Regex matching function.</p>
          <p class="center">When you're satisfied, click the checkmark to save.</p>
          <p class="center">If you want to edit a category, simply click the edit button to the right of each category.</p>
        </Summarydetails>
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
  p.center {
    text-align: center;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
</style>