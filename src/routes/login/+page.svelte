<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Header from "$lib/components/header.svelte";

  const redirect = page.url.searchParams.get('redirect') || '/';
  
  let error: string = $state('');

  let username: string = $state('');
  let password: string = $state('');

  async function submit () {
    if (!username || !password) {
      error = 'Username or password missing';
      return;
    }
    const resp = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (!resp.ok) {
      const { message } = await resp.json();

      error = message;
    }
    else goto(redirect);
  }
</script>

<div class="page">
  <main class="innerpage">
    <form onsubmit={submit}>
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