<script lang="ts">
  export let navigate: (page: string) => void;
  import { Tooltip } from "flowbite-svelte";
  import {
    GridOutline,
    FilePenOutline,
    UsersGroupOutline,
    AngleLeftOutline,
    AngleRightOutline,
    ChartOutline,
    GlobeSolid,
    AdjustmentsVerticalSolid,
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
      <button on:click={() => handleNavigation("dashboard")} id="dashboard">
        <ChartOutline class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}">Dashboard</span>
      </button>
      <Tooltip triggeredBy="#dashboard" placement="right">Dashboard</Tooltip>

      <!-- Saved Assessments Page -->
      <button
        on:click={() => handleNavigation("savedassessments")}
        id="saved-assessments"
      >
        <GridOutline class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}"
          >Saved Assessments</span
        >
      </button>
      <Tooltip triggeredBy="#saved-assessments" placement="right"
        >Saved Assessments</Tooltip
      >

      <button on:click={() => handleNavigation("quizzes")} id="quizzes">
        <FilePenOutline class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}"
          >Create Assessments</span
        >
      </button>
      <Tooltip triggeredBy="#quizzes" placement="right"
        >Create Assessments</Tooltip
      >

      <button
        on:click={() => handleNavigation("manageAssessments")}
        id="manage-assessments"
      >
        <AdjustmentsVerticalSolid class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}"
          >Manage Assessments</span
        >
      </button>
      <Tooltip triggeredBy="#manage-assessments" placement="right"
        >Manage Assessments</Tooltip
      >

      <button
        on:click={() => handleNavigation("studentsInfo")}
        id="studentsInfo"
      >
        <UsersGroupOutline class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}">Student's Info</span>
      </button>
      <Tooltip triggeredBy="#studentsInfo" placement="right"
        >Student's Info</Tooltip
      >

      <button on:click={() => handleNavigation("manageData")} id="manage-data">
        <GlobeSolid class="w-10 h-10" />
        <span class="text {sidebarHidden ? 'hidden' : ''}">Manage Data</span>
      </button>
      <Tooltip triggeredBy="#manage-data" placement="right">Manage Data</Tooltip
      >
    </div>
  </div>

  <div class="sidebarControl">
    <button id="sidebarControl" on:click={toggleSidebar}>
      {#if sidebarHidden}
        <AngleRightOutline />
      {:else}
        <AngleLeftOutline />
      {/if}
    </button>
    <Tooltip placement="right">Toggle Sidebar</Tooltip>
  </div>
</div>

<style>
  .sidebar {
    position: sticky;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    height: calc(100vh - 4rem);
    color: var(--text);
    z-index: 50;
    width: 22rem; /* Full width when expanded */
    transition: width 0.3s ease-in-out; /* Smooth transition for width */
    white-space: nowrap;
  }
  .collapsed {
    width: 6rem; /* Collapsed width */
  }
  .navigation-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-weight: 400;
    border: 3px solid var(--border);
    box-shadow: 5px 7px 0px 0px var(--text);
    cursor: pointer;
  }

  #saved-assessments,
  #quizzes,
  #studentsInfo,
  #dashboard,
  #manage-data,
  #manage-assessments {
    & span {
      color: var(--text);
    }
  }

  #dashboard {
    background-color: var(--primary);
    color: var(--border);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    &:active {
      box-shadow: none;
      transform: translate(5px, 7px);
    }
  }
  #saved-assessments {
    background-color: var(--secondary);
    color: var(--border);

    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    &:active {
      box-shadow: none;
      transform: translate(5px, 7px);
    }
  }
  #quizzes {
    background-color: var(--accent);
    color: var(--border);

    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    &:active {
      box-shadow: none;
      transform: translate(5px, 7px);
    }
  }
  #studentsInfo {
    background-color: var(--background);
    color: var(--border);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    &:active {
      box-shadow: none;
      transform: translate(5px, 7px);
    }
  }
  #manage-data {
    background-color: #c4a1ff;
    color: var(--border);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    &:active {
      box-shadow: none;
      transform: translate(5px, 7px);
    }
  }

  #manage-assessments {
    background-color: #ffc0cb;
    color: var(--border);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    &:active {
      box-shadow: none;
      transform: translate(5px, 7px);
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
    position: fixed;
    background-color: var(--background);
    bottom: 1rem;
    left: 1rem;
  }
</style>
