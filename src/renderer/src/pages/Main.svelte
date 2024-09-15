<script lang="ts">
  import TopBar from '../components/TopBar.svelte'
  import NavBar from '../components/NavBar.svelte'
  import { Classes, Quizzes, StudentsInfo } from '../pages/'
  export let logout: () => void

  const pages = {
    classes: Classes,
    quizzes: Quizzes,
    studentsInfo: StudentsInfo
  }

  let currentPage = 'classes'
  // Navigation function to switch between pages
  function navigate(page: string) {
    currentPage = page
  }
</script>

<TopBar />
<div class="container">
  <NavBar {navigate} />
  <main class="screen">
    <svelte:component this={pages[currentPage]} />
  </main>
  <button on:click={logout}>Logout</button>
</div>

<style>
</style>
