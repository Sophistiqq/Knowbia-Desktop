<script>
  import { onMount } from 'svelte'
  import { Classes, Quizzes, StudentsInfo } from './pages/'
  import NavBar from './components/NavBar.svelte'
  import TopBar from './components/TopBar.svelte'

  let currentPage = 'classes'
  let isAuthenticated = false
  let student_number = ''
  let password = ''
  let loginError = ''

  const pages = {
    classes: Classes,
    quizzes: Quizzes,
    studentsInfo: StudentsInfo
  }

  function navigate(page) {
    currentPage = page
  }

  async function login() {
    if (!student_number || !password) {
      loginError = 'Please fill in both fields.'
      return
    }
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ student_number, password })
      })

      const result = await response.json()

      if (response.ok) {
        isAuthenticated = true
        localStorage.setItem('authToken', result.token) // Store the token
        loginError = ''
      } else {
        loginError = result.message || 'Invalid credentials'
      }
    } catch (error) {
      console.error('Error:', error)
      loginError = 'An error occurred while trying to log in.'
    }
  }

  function logout() {
    isAuthenticated = false
    localStorage.removeItem('authToken')
  }

  // On mount, check for authentication status and validate token
  onMount(async () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await fetch('http://localhost:3000/auth/validate', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          isAuthenticated = true
        } else {
          localStorage.removeItem('authToken')
        }
      } catch (error) {
        console.error('Error validating token:', error)
        localStorage.removeItem('authToken')
      }
    }
  })
</script>

{#if isAuthenticated}
  <TopBar />
  <div class="container">
    <NavBar {navigate} />
    <main class="screen">
      <svelte:component this={pages[currentPage]} />
    </main>
    <button on:click={logout}>Logout</button>
  </div>
{:else}
  <div class="login-form">
    <h2>Login</h2>
    {#if loginError}
      <div class="error-message">{loginError}</div>
    {/if}
    <label for="student_number">Student Number:</label>
    <input type="text" id="student_number" bind:value={student_number} />
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />
    <button on:click={login}>Login</button>
  </div>
{/if}

<style>
  .container {
    display: flex;
    height: calc(100vh - 4rem);
  }
  .screen {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
</style>
