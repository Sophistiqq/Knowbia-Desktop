<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let className: string;
  export let section: string;
  export let enrolledStudents: number;
  export let id: number;

  function showStudents() {
    dispatch("changeView", { view: "students", className });
  }

  function showAssessments() {
    dispatch("changeView", { view: "assessments", className });
  }

  function hostAssessment() {
    dispatch("changeView", { view: "host", className });
  }
</script>

<div class="class-card">
  <h1>{className}</h1>
  <p>Class ID: {id}</p>
  <p>Section: {section}</p>
  <p>Enrolled Students: {enrolledStudents}</p>

  <div class="separator"></div>

  <div class="toolbar">
    <button on:click={showStudents}>View Students</button>
    <button on:click={showAssessments}>View Assessments</button>
    <button on:click={hostAssessment}>Host Assessment</button>
  </div>
</div>

<style>
  .class-card {
    margin-block: 2rem;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    backdrop-filter: blur(5px);
    width: 60vw;
    border-radius: 8px;
    padding: 1.5rem;
    & h1 {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    & .toolbar {
      display: flex;
      gap: 1rem;
      justify-content: space-around;
    }
  }

  .separator {
    border-top: 1px solid var(--border);
    margin: 1rem 0;
  }
</style>
