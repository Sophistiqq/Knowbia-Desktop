<script>
  export let currentClass;
  export let students; // Receive students data as a prop
</script>

<div>
  <h2>Students in {currentClass}</h2>
  <ul>
    {#each students as student}
      <li>
        <strong>{student.name}</strong> - Age: {student.age}, Status: {student.status}
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
