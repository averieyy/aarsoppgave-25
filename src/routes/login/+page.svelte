<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { handleForm } from "$lib/forms";

  // Get the redirect website parameter (?redirect=...). Default to /
  const redirect = page.url.searchParams.get('redirect') || '/';
  
  let error: string = $state('');

  // State variables
  let username: string = $state('');
  let password: string = $state('');

  // Log in
  async function submit () {
    // Check that the username and password input have contents
    if (!username || !password) {
      error = 'Username or password missing';
      return;
    }
    // Send POST request
    const resp = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (!resp.ok) {
      // Show error message
      const { message } = await resp.json();

      error = message;
    }
    // Redirect if everything went well
    else goto(redirect);
  }
</script>

<svelte:head>
  <title>Speedrun - Login</title>
</svelte:head>

<div class="page">
  <main class="innerpage">
    <form onsubmit={ev => handleForm(ev, submit)}>
      <h2>Login</h2>
      {#if error}
        <span class="error">
          {error}
        </span>
      {/if}
      <input required bind:value={username} type="text" placeholder="Username" maxlength="24">
      <input required bind:value={password} type="password" placeholder="Password">
      <input type="submit" value="Log in">
    </form>
    <a href="/register?redirect={redirect}" class="link">Register</a>
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