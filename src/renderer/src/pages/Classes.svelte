<script lang="ts">
  import ClassCard from "../components/ClassCard.svelte";
  import StudentsView from "../components/StudentsView.svelte";
  import AssessmentsView from "../components/AssessmentsView.svelte";
  import HostView from "../components/HostView.svelte";
  import {
    classList,
    students,
    assessments,
    assessmentsToHost,
  } from "../scripts/ClassesData";
  // Sample class data (can be replaced with your actual data)

  // Reactive variable to track the current view
  let currentView = null;
  let currentClass = "";

  function handleViewChange(event: CustomEvent) {
    currentView = event.detail.view;
    currentClass = event.detail.className;
  }

  function goBackToClassList() {
    // Reset view to show the class list again
    currentView = null;
  }
</script>

<!-- Display class cards only if no specific view is selected -->
{#if currentView === null}
  <div class="class-list">
    {#each classList as classes (classes.id)}
      <ClassCard
        className={classes.className}
        section={classes.section}
        enrolledStudents={classes.enrolledStudents}
        id={classes.id}
        on:changeView={handleViewChange}
      />
    {/each}
  </div>
{:else}
  <!-- Conditionally render the view with transitions and hide the class list -->
  <div class="content-section">
    {#if currentView === "students"}
      <StudentsView {currentClass} {students} />
    {:else if currentView === "assessments"}
      <AssessmentsView {currentClass} {assessments} />
    {:else if currentView === "host"}
      <HostView {currentClass} {assessmentsToHost} />
    {/if}

    <!-- Add a "Back" button to go back to the class list -->
    <button on:click={goBackToClassList}>Back to Class List</button>
  </div>
{/if}

<style>
  .class-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .content-section {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background-color: var(--background-light);
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    background-color: var(--button-bg);
    color: var(--button-text);
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--button-hover-bg);
  }
</style>
