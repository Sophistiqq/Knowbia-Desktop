<script>
  export let currentClass;
  export let assessments; // Receive assessments data as a prop
</script>

<div>
  <h2>Assessments for {currentClass}</h2>
  <ul>
    {#each assessments as assessment}
      <li>
        <strong>{assessment.title}</strong> - Date: {assessment.date}, Status: {assessment.status}
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
</style>
