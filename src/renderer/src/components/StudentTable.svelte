<script lang="ts">
  export let students: Array<{
    id: number;
    student_number: string;
    firstname: string;
    lastname: string;
    email: string;
  }> = []; // Accept students array as a prop
  export let onStudentClick; // Function to handle row clicks

  // State to track sorting
  let sortKey: string = "";
  let sortDirection: "asc" | "desc" = "asc";

  const sortBy = (key: string) => {
    // Toggle sort direction if the same key is clicked
    if (sortKey === key) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortDirection = "asc"; // Reset to ascending if a new key is clicked
    }

    // Sort students array based on sortKey and sortDirection
    students = [...students].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };
</script>

<table class="student-table">
  <thead>
    <tr>
      <th on:click={() => sortBy("id")}>ID</th>
      <th on:click={() => sortBy("student_number")}>Student Number</th>
      <th on:click={() => sortBy("firstname")}>First Name</th>
      <th on:click={() => sortBy("lastname")}>Last Name</th>
      <th on:click={() => sortBy("email")}>Email</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each students as student (student.id)}
      <tr on:click={() => onStudentClick(student)}>
        <td>{student.id}</td>
        <td>{student.student_number}</td>
        <td>{student.firstname}</td>
        <td>{student.lastname}</td>
        <td>{student.email}</td>
        <td>
          <button on:click={() => onStudentClick(student)}>View Details</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  .student-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--background);
    color: var(--text);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
  }

  thead {
    background-color: var(--primary);
    color: var(--background);
  }

  th,
  td {
    padding: 1rem; /* Increased padding for better spacing */
    text-align: left;
    border: 1px solid var(--text);
    cursor: pointer; /* Add cursor pointer to indicate clickable headers */
  }

  th {
    background-color: var(--accent);
    color: var(--background);
    transition: background-color 0.3s; /* Smooth transition */
  }

  th:hover {
    background-color: var(--primary); /* Highlight on hover */
  }

  tbody tr:hover {
    background-color: var(--secondary);
  }

  button {
    color: var(--text);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: var(--text);
  }
</style>
