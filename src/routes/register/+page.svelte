<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { handleForm } from "$lib/forms";

  const redirect = page.url.searchParams.get('redirect') || '/';
  
  let error: string = $state('');

  let username: string = $state('');
  let password: string = $state('');
  let email: string = $state('');

  async function submit () {
    const resp = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        email
      }),
    });

    if (!resp.ok) {
      const { message } = await resp.json();

      error = message;
    }
    else goto(redirect);
  }
</script>

<svelte:head>
  <title>Speedrun - Register</title>
</svelte:head>

<div class="page">
  <main class="innerpage">
    <form onsubmit={ev => handleForm(ev, submit)}>
      <h2>Register</h2>
      {#if error}
        <span class="error">
          {error}
        </span>
      {/if}
      <input required bind:value={username} type="text" placeholder="Username" maxlength="24">
      <input required bind:value={email} type="email" placeholder="Email address">
      <input required bind:value={password} type="password" placeholder="Password">
      <input type="submit" value="Register">
    </form>
    <a href="/login?redirect={redirect}" class="link">Log in</a>
  </main>
</div>

<style>
  .innerpage {
    justify-content: center;
    align-items: center;
  }
  form {
    background-color: var(--bg2);
    padding: .5rem;
    max-width: 400px;
    width: 50%;
    min-width: 300px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
</style>