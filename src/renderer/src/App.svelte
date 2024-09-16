<script lang="ts">
  import { onMount } from 'svelte'
  import Main from './pages/Main.svelte'
  import { login, checkAuth } from './scripts/auth.js'
  import { Icon } from 'svelte-icons-pack'
  import { FaSolidUser, FaSolidKey, FaSolidEyeSlash, FaSolidEye } from 'svelte-icons-pack/fa'
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

  function showError(message: string) {
    loginError = message
    setTimeout(() => {
      loginError = ''
    }, 10000)
  }
  // reactive password visibility variable
  let showPassword = false
  function togglePasswordVisibility() {
    showPassword = !showPassword
    const passwordInput = document.getElementById('password')
    if (passwordInput) {
      passwordInput.setAttribute('type', showPassword ? 'text' : 'password')
    }
  }
</script>

{#if loading}
  <h1>Loading ...</h1>
{:else}
  {#if loginError}
    <div class="error-message">{loginError}</div>
  {/if}

  {#if isAuthenticated}
    <Main {logout} />
  {:else if !isAuthenticated}
    <div class="container">
      <div class="login-form">
        <h1>Welcome to Knowbia!</h1>

        <div class="input_fields">
          <label for="student_number">Student Number</label>
          <div class="inputs">
            <Icon src={FaSolidUser} />
            <input type="text" id="student_number" bind:value={student_number} required />
          </div>
        </div>
        <div class="input_fields">
          <label for="password">Password</label>
          <div class="inputs">
            <Icon src={FaSolidKey} />
            <input type="password" id="password" bind:value={password} required />
            <button on:click={togglePasswordVisibility}>
              <Icon src={showPassword ? FaSolidEye : FaSolidEyeSlash} />
            </button>
          </div>
        </div>

        <div class="forgot_password">
          <button>Forgot Password?</button>
        </div>
        <button on:click={handleLogin} id="loginButton">Login</button>

        <div class="separator">
          <div class="line"></div>
          <div class="or">or</div>
          <div class="line"></div>
        </div>
        <button id="signUp">Sign Up</button>
      </div>
    </div>
  {/if}
{/if}

<style lang="scss">
  :global(body) {
    &::before {
      content: '';
      position: fixed;
      background-color: #e5e5f7;
      opacity: 0.1;
      background-image: repeating-radial-gradient(circle at 0 0, transparent 0, #e5e5f7 33px),
        repeating-linear-gradient(#444cf755, #444cf7);
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .login-form {
    background: transparent;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.25);
    display: flex;
    flex-direction: column;
    padding: 5rem;
    border-radius: 2rem;
    border-bottom-right-radius: 0;
    box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.1);
    gap: 0.5rem;
  }
  .login-form h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
  .input_fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .inputs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      padding: 0.3rem 1rem;
      border-radius: 0.5rem;
      align-items: center;
      gap: 0.5rem;
      input {
        margin-left: 0.3rem;
        flex-grow: 1;
        background: none;
        padding: 0.5rem;
        border: none;
        border-left: 1px solid #ccc;
        &:focus {
          outline: none;
        }
      }
      button {
        background: none;
        border: none;
        cursor: pointer;
      }
    }
  }
  .forgot_password {
    display: flex;
    justify-content: flex-end;
    button {
      background: none;
      border: none;
      cursor: pointer;
      color: #007bff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .error-message {
    position: absolute;
    background-color: #f8d7da;
    padding: 1rem;
    border-radius: 0.5rem;
    color: red;
    text-align: center;
    margin-bottom: 1rem;
    animation: popdown 10s;
  }
  @keyframes popdown {
    0% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  #loginButton {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 1rem 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  .separator {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    .line {
      flex: 1;
      height: 1px;
      background-color: #ccc;
    }
    .or {
      padding: 0.5rem;
    }
  }
  #signUp {
    margin-top: 1rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
