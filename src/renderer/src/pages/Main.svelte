<script lang="ts">
  import NavBar from "../components/NavBar.svelte";
  import {
    Classes,
    MakeAssessment,
    StudentsInfo,
    Dashboard,
    SavedAssessments,
  } from "../pages/";
  import "../assets/tailwind.css";
  import TopBar from "../components/TopBar.svelte";
  import NotificationsSide from "../components/NotificationsSide.svelte";

  const pages = {
    classes: Classes,
    quizzes: MakeAssessment,
    studentsInfo: StudentsInfo,
    dashboard: Dashboard,
    savedassessments: SavedAssessments,
  };

  let currentPage = "classes";

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
  <div class="notificationBar">
    <NotificationsSide />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
  }
  .screen {
    flex: 1;
    padding: 2rem;
    width: calc(100vw - 15rem);
  }
</style>
