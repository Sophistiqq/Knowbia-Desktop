<script lang="ts">
  import NavBar from "../components/NavBar.svelte";
  import {
    MakeAssessment,
    StudentsInfo,
    Dashboard,
    ManageAssessments,
    AssessmentResults
  } from "../pages/";
  import "../assets/tailwind.css";
  import TopBar from "../components/TopBar.svelte";
  import NotificationsSide from "../components/NotificationsSide.svelte";

  const pages = {
    quizzes: MakeAssessment,
    studentsInfo: StudentsInfo,
    dashboard: Dashboard,
    assessmentResults: AssessmentResults,
    makeassessment: MakeAssessment,
    manageassessments: ManageAssessments,
  };

  let currentPage = "dashboard";

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
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 2rem;
      left: 0;
      width: 1px;
      height: 100%;
      background-color: var(--border);
      z-index: -1;
    }
  }
</style>
