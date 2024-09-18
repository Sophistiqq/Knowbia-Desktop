<script lang="ts">
  import NavBar from "../components/NavBar.svelte";
  import { Classes, Quizzes, StudentsInfo } from "../pages/";
  import "../assets/tailwind.css";
  import TopBar from "../components/TopBar.svelte";
  const pages = {
    classes: Classes,
    quizzes: Quizzes,
    studentsInfo: StudentsInfo,
  };

  let currentPage = "classes";
  // Navigation function to switch between pages
  function navigate(page: string) {
    currentPage = page;
  }

  export let logout: () => void;
</script>

<TopBar {logout} />
<div class="container">
  <NavBar {navigate} />
  <main class="screen">
    <svelte:component this={pages[currentPage]} />
  </main>
</div>

<style>
</style>
