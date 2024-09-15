<script lang="ts">
  import { onMount } from "svelte";
  import { Classes, Quizzes, StudentsInfo } from "./pages/";
  import NavBar from "./components/NavBar.svelte";
  import TopBar from "./components/TopBar.svelte";

  let currentPage = "classes";
  let isAuthenticated = false;
  let student_number = "";
  let password = "";
  let loginError = "";

  const pages = {
    classes: Classes,
    quizzes: Quizzes,
    studentsInfo: StudentsInfo,
  };

  // Navigation function to switch between pages
  function navigate(page) {
    currentPage = page;
  }

  async function login() {
    if (!student_number || !password) {
      loginError = "Please fill in both fields.";
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_number, password }),
        credentials: "include", // Send session cookie with request
      });

      if (response.ok) {
        isAuthenticated = true;
        loginError = "";
      } else {
        const result = await response.json();
        loginError = result.message || "Invalid credentials";
      }
    } catch (error) {
      console.error("Error:", error);
      loginError = "An error occurred while trying to log in.";
    }
  }

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/authenticate", {
        method: "GET",
        credentials: "include", // Ensure session cookie is included
      });

      if (response.ok) {
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Logout function to clear the session
  async function logout() {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include", // This ensures the session cookie is included in the request
    });
    isAuthenticated = false;
    student_number = "";
    password = "";
  }
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
