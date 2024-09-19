<script lang="ts">
  import { onMount } from "svelte";
  import Main from "./pages/Main.svelte";
  import { login, checkAuth } from "./scripts/auth.js";
  import { Icon } from "svelte-icons-pack";
  import {
    FaSolidUser,
    FaSolidKey,
    FaSolidEyeSlash,
    FaSolidEye,
  } from "svelte-icons-pack/fa";
  import Register from "./pages/Register.svelte";
  import { fly } from "svelte/transition"; // Import fly transition
  import { cubicInOut, cubicOut } from "svelte/easing";
  import { DarkMode } from "flowbite-svelte";
  import { SunSolid, MoonSolid } from "flowbite-svelte-icons";
  import "./assets/main.css";
  let isAuthenticated = false;
  let loading = true;
  let email = "";
  let password = "";
  let loginError = "";
  export let showRegisterPage = false;

  async function handleLogin() {
    const result = await login(email, password);
    if (result.success) {
      isAuthenticated = true;
      loginError = "";
    } else {
      showError(result.message);
    }
  }

  onMount(async () => {
    const authStatus = await checkAuth();
    isAuthenticated = authStatus.isAuthenticated;

    const savedPage = localStorage.getItem("showRegisterPage");
    if (savedPage !== null) {
      showRegisterPage = JSON.parse(savedPage);
    }

    loading = false;
  });

  async function logout() {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    isAuthenticated = false;
    localStorage.removeItem("user");
  }

  function showError(message: string) {
    loginError = message;
    setTimeout(() => {
      loginError = "";
    }, 10000);
  }

  function showRegister() {
    showRegisterPage = true;
    localStorage.setItem("showRegisterPage", JSON.stringify(showRegisterPage));
  }

  function showLogin() {
    showRegisterPage = false;
    localStorage.setItem("showRegisterPage", JSON.stringify(showRegisterPage));
  }

  let showPassword = false;
  function togglePasswordVisibility() {
    showPassword = !showPassword;
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      passwordInput.setAttribute("type", showPassword ? "text" : "password");
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
  {:else if showRegisterPage}
    <!-- Registration Form with transition -->
    <div transition:fly={{ x: -200, duration: 500, easing: cubicOut }}>
      <DarkMode
        class="absolute top-5 left-5 dark:text-primary-600 border dark:border-gray-800 z-50"
      >
        <SunSolid slot="lightIcon" color="yellow" />
        <MoonSolid slot="darkIcon" />
      </DarkMode>
      <Register onBackToLogin={showLogin} />
    </div>
  {:else}
    <!-- Login Form with transition -->
    <div
      class="container"
      transition:fly={{ x: -200, duration: 500, easing: cubicInOut }}
    >
      <div class="login-form">
        <DarkMode
          class="absolute top-5 left-5 dark:text-primary-600 border dark:border-gray-800 z-50"
        >
          <SunSolid slot="lightIcon" color="yellow" />
          <MoonSolid slot="darkIcon" />
        </DarkMode>
        <h1>Welcome to Knowbia!</h1>

        <div class="input_fields">
          <label for="email">Email</label>
          <div class="inputs">
            <Icon src={FaSolidUser} />
            <input
              type="email;
              "
              id="email"
              bind:value={email}
              required
            />
          </div>
        </div>
        <div class="input_fields">
          <label for="password">Password</label>
          <div class="inputs">
            <Icon src={FaSolidKey} />
            <input
              type="password"
              id="password"
              bind:value={password}
              required
            />
            <button on:click={togglePasswordVisibility} tabindex="-1">
              <Icon src={showPassword ? FaSolidEye : FaSolidEyeSlash} />
            </button>
          </div>
        </div>

        <div class="forgot_password">
          <button tabindex="-1">Forgot Password?</button>
        </div>
        <button on:click={handleLogin} id="loginButton">Login</button>

        <div class="separator">
          <div class="line"></div>
          <div class="or">or</div>
          <div class="line"></div>
        </div>
        <button on:click={showRegister} id="signUp">Sign Up</button>
      </div>
    </div>
  {/if}
{/if}

<style lang="scss">
  .container {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    min-height: 100vh;
  }

  .login-form {
    background: var(--background);
    color: var(--text);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    width: 60vw;
    max-width: 600px;
    padding: 5rem;
    box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.1);
    gap: 0.5rem;
  }
  .login-form h1 {
    color: var(--text);
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1rem;
  }
  .input_fields {
    display: flex;
    color: var(--text);
    flex-direction: column;
    gap: 0.5rem;
    & label {
      font-size: 1.2rem;
      color: var(--text);
    }
    .inputs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text);
      border: 1px solid var(--border);
      padding: 0.3rem 1rem;
      border-radius: 0.5rem;
      align-items: center;
      gap: 0.5rem;
      & button {
        border: none;
        cursor: pointer;
      }
      & input {
        outline: none;
        margin-left: 0.3rem;
        flex-grow: 1;
        color: var(--text);
        background: transparent;
        padding: 0.5rem;
        border: none;
        border-left: 1px solid var(--border);
        &:focus {
          outline: none;
        }
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
      color: var(--text);
      transition: color 0.5s;
      &:hover {
        color: var(--accent);
        text-decoration: underline;
      }
    }
  }
  .error-message {
    position: fixed;
    z-index: 1000;
    top: 1rem;
    right: 1rem;
    background-color: var(--accent);
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
    background-color: var(--primary);
    color: var(--background);
    border: none;
    font-weight: 500;
    padding: 1rem 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.5s;
    &:hover {
      background-color: var(--accent);
    }
  }
  .separator {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    .line {
      flex: 1;
      height: 1px;
      background-color: var(--border);
    }
    .or {
      padding: 0.5rem;
    }
  }
  #signUp {
    padding: 1rem 0.5rem;
    margin-top: 1rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: color 0.5s;
    &:hover {
      text-decoration: underline;
      color: var(--accent);
    }
  }
</style>
