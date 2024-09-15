<script lang="ts">
  import { onMount } from 'svelte'
  import Main from './pages/Main.svelte'
  import { login, checkAuth } from './scripts/auth.js'

  let isAuthenticated = false
  let loading = true // Add a loading state
  let student_number = ''
  let password = ''
  let loginError = ''

  async function handleLogin() {
    const result = await login(student_number, password)
    if (result.success) {
      isAuthenticated = true
      loginError = ''
    } else {
      showError(result.message)
    }
  }

  onMount(async () => {
    const authStatus = await checkAuth()
    isAuthenticated = authStatus.isAuthenticated
    loading = false // Set loading to false after authentication check
  })

  async function logout() {
    await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    isAuthenticated = false
  }

  function showError(message) {
    loginError = message
    setTimeout(() => {
      loginError = ''
    }, 5000)
  }
</script>

{#if loading}
  <!-- Display a loading spinner or empty screen -->
  <div class="loading-screen">Loading...</div>
{:else}
  {#if loginError}
    <div class="error-message">{loginError}</div>
  {/if}

  {#if isAuthenticated}
    <Main {logout} />
  {:else}
    <div class="container">
      <div class="login-form">
        <h2>Login</h2>
        <label for="student_number">
          Student Number
          <input type="text" id="student_number" bind:value={student_number} />
        </label>
        <label for="password">
          Password
          <input type="password" id="password" bind:value={password} />
        </label>
        <button on:click={handleLogin}>Login</button>
      </div>
    </div>
  {/if}
{/if}

<style lang="scss">
  .container {
    display: grid;
    place-items: center;
    height: 100vh;
    width: 100%;
  }
  .login-form {
    border: 1px solid #ccc;
    padding: 5rem;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.75rem;
    label {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      input {
        border-radius: 0.5rem;
        border: 1px solid #ccc;
        padding: 0.5rem;
      }
    }
    button {
      padding: 0.75rem;
      border-radius: 0.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      font-weight: bold;
      &:hover {
        background-color: #0056b3;
      }
    }
  }
  .error-message {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    animation: fadeOut 5s forwards;
    position: absolute;
    @keyframes fadeOut {
      to {
        opacity: 0;
      }
    }
  }
  .loading-screen {
    display: grid;
    place-items: center;
    height: 100vh;
    font-size: 1.5rem;
    color: #007bff;
  }
</style>
