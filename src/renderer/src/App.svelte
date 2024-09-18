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

  let isAuthenticated = false;
  let loading = true;
  let student_number = "";
  let password = "";
  let loginError = "";
  export let showRegisterPage = false;

  async function handleLogin() {
    const result = await login(student_number, password);
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
      <Register onBackToLogin={showLogin} />
    </div>
  {:else}
    <!-- Login Form with transition -->
    <div
      class="container"
      transition:fly={{ x: -200, duration: 500, easing: cubicInOut }}
    >
      <div class="login-form">
        <h1>Welcome to Knowbia!</h1>

        <div class="input_fields">
          <label for="student_number">Student Number</label>
          <div class="inputs">
            <Icon src={FaSolidUser} />
            <input
              type="text"
              id="student_number"
              bind:value={student_number}
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
  :global(body) {
    &::before {
      content: "";
      position: fixed;
      background-color: #e5e5f7;
      opacity: 0.3;
      background-image: radial-gradient(#5c5c5c 2px, #e5e5f7 2px);
      background-size: 40px 40px;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -15;
      animation: move 5s infinite ease-in-out;
    }
    &:hover::before {
      animation-play-state: paused;
    }
  }
  @keyframes move {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 100px 100px;
    }
    100% {
      background-position: 0 0;
    }
  }

  .container {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
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
    justify-content: center;
    height: 100vh;
    width: 60vw;
    max-width: 600px;
    padding: 5rem;
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
    position: fixed;
    z-index: 1000;
    top: 1rem;
    right: 1rem;
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
    padding: 1rem 0.5rem;
    margin-top: 1rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  input {
    outline: none;
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
</style>
