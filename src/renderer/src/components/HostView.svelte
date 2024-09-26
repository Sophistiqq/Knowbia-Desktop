<script>
  export let currentClass;
  export let assessmentsToHost; // Receive assessments to host data as a prop

  function startHosting(assessment) {
    console.log(`Starting to host ${assessment.title} for ${currentClass}`);
  }
</script>

<div>
  <h2>Host an assessment for {currentClass}</h2>
  <ul>
    {#each assessmentsToHost as assessment}
      <li>
        <strong>{assessment.title}</strong> - Scheduled for: {assessment.scheduledDate}
        <button on:click={() => startHosting(assessment)}>Host Now</button>
      </li>
    {/each}
  </ul>
</div>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
  }

  button {
    margin-left: 1rem;
    padding: 0.25rem 0.5rem;
    background-color: var(--button-bg);
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--button-hover-bg);
  }
</style>
