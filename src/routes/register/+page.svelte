<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Header from "$lib/components/header.svelte";

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

<div class="page">
  <Header />
  <main class="innerpage">
    <form onsubmit={submit}>
      <h2>Register</h2>
      {#if error}
        <span class="error">
          {error}
        </span>
      {/if}
      <input bind:value={username} type="text" placeholder="Username" maxlength="24">
      <input bind:value={email} type="email" placeholder="Email address">
      <input bind:value={password} type="password" placeholder="Password">
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