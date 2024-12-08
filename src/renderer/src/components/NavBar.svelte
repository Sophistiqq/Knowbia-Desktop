<script lang="ts">
  export let navigate: (page: string) => void;
  import { Tooltip } from "flowbite-svelte";
  import {
    UsersGroupSolid,
    CaretLeftSolid,
    CaretRightSolid,
    ChartPieSolid,
    ArchiveSolid,
    PaperPlaneSolid,
    CogSolid,
    ArrowsRepeatOutline,
  } from "flowbite-svelte-icons";
  import { onMount } from "svelte";

  // Track if sidebar is collapsed and current page
  let sidebarHidden = false;
  let currentPage = "dashboard"; // Default page

  // Load sidebar state and current page from localStorage on component mount
  onMount(() => {
    const savedState = localStorage.getItem("sidebarHidden");
    sidebarHidden = savedState === "true"; // Parse the saved state
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      currentPage = savedPage; // Set the current page if available
      navigate(currentPage); // Navigate to the saved page
    }
  });

  // Save sidebar state and current page to localStorage when it changes
  function toggleSidebar() {
    sidebarHidden = !sidebarHidden;
    localStorage.setItem("sidebarHidden", sidebarHidden.toString()); // Save the state
  }

  function handleNavigation(page: string) {
    currentPage = page; // Update current page
    localStorage.setItem("currentPage", currentPage); // Save current page
    navigate(currentPage); // Navigate to the selected page
  }
</script>

<div class="sidebar {sidebarHidden ? 'collapsed' : ''}">
  <div class="buttons-container">
    <div class="navigation-buttons">
      <div class="sidebarControl flex flex-col justify-start items-start gap-4">
        <button id="sidebarControl" on:click={toggleSidebar}>
          {#if sidebarHidden}
            <CaretRightSolid />
          {:else}
            <CaretLeftSolid />
          {/if}
        </button>
        <Tooltip placement="right">Toggle Sidebar</Tooltip>
        <button id="refresh" on:click={() => location.reload()}>
          <ArrowsRepeatOutline />
        </button>
        <Tooltip triggeredBy="#refresh" placement="right"
          >Refresh if you have connectivity issues</Tooltip
        >
      </div>
      <button on:click={() => handleNavigation("dashboard")} id="dashboard">
        <ChartPieSolid class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}">Dashboard</span>
      </button>
      <Tooltip triggeredBy="#dashboard" placement="right">Dashboard</Tooltip>

      <button on:click={() => handleNavigation("quizzes")} id="quizzes">
        <PaperPlaneSolid class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}"
          >Create Assessments</span
        >
      </button>
      <Tooltip triggeredBy="#quizzes" placement="right"
        >Create Assessments</Tooltip
      >

      <button
        on:click={() => handleNavigation("manageassessments")}
        id="manage-quizzes"
      >
        <CogSolid class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}"
          >Manage Assessments</span
        >
      </button>
      <Tooltip triggeredBy="#manage-quizzes" placement="right"
        >Manage Assessments</Tooltip
      >

      <button
        on:click={() => handleNavigation("assessmentResults")}
        id="manage-assessments"
      >
        <ArchiveSolid class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}"
          >Assessment Results</span
        >
      </button>
      <Tooltip triggeredBy="#manage-assessments" placement="right"
        >Assessment Results</Tooltip
      >

      <button
        on:click={() => handleNavigation("studentsInfo")}
        id="studentsInfo"
      >
        <UsersGroupSolid class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}">Student's Info</span>
      </button>
      <Tooltip triggeredBy="#studentsInfo" placement="right"
        >Student's Info</Tooltip
      >
    </div>
  </div>
</div>

<style>
  .sidebar {
    position: sticky;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: clamp(100vh, 100%, 100vh);
    gap: 1rem;
    color: var(--text);
    z-index: 50;
    width: 20rem; /* Full width when expanded */
    transition: width 0.3s ease-in-out; /* Smooth transition for width */
    white-space: nowrap;
    padding-top: 2rem;
    transition: all 0.3s ease;
  }
  .collapsed {
    width: 5rem; /* Collapsed width */
  }
  .navigation-buttons {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    font-weight: 400;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease;
    font-weight: 700;
    padding: 1rem;
    border-left: 4px solid var(--text);
    &:hover {
      background-color: var(--hover);
      box-shadow: 0 0 10px 10px rgba(100, 100, 100, 0.1);
      transform: scale(1.1);
      border-radius: 0 1rem 1rem 0;
    }
    &:active {
      box-shadow: none;
      background-color: var(--active);
    }
  }

  .text {
    transition: opacity 0.3s ease;
  }
  .hidden {
    opacity: 0;
    visibility: hidden;
    width: 0;
  }
  .sidebarControl {
    display: flex;
    position: block;
    padding: 2rem 1rem;
    color: var(--border);
    & button {
      background-color: var(--background);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: var(--hover);
        color: var(--text-hover);
      }
    }
  }
</style>
