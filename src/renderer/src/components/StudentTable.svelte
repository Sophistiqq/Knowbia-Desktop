<script lang="ts">
  export let students: Array<{
    studentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    section: string;
  }> = []; // Accept students array as a prop
  export let onStudentClick: any; // Function to handle row clicks

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
      <th on:click={() => sortBy("studentNumber")}>Student Number</th>
      <th on:click={() => sortBy("firstName")}>First Name</th>
      <th on:click={() => sortBy("lastName")}>Last Name</th>
      <th on:click={() => sortBy("email")}>Email</th>
      <th on:click={() => sortBy("section")}>Section</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each students as student (student)}
      <tr on:click={() => onStudentClick(student)}>
        <td>{student.studentNumber}</td>
        <td>{student.firstName}</td>
        <td>{student.lastName}</td>
        <td class="email">{student.email}</td>
        <td>{student.section}</td>
        <td>
          <button on:click={() => onStudentClick(student)}>View Details</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .student-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--background);
    color: var(--text);
    font-size: 90%;
    backdrop-filter: blur(10px);
  }

  thead {
    color: var(--secondary);
    background-color: var(--accent);
  }

  th,
  td {
    padding: 1rem; /* Increased padding for better spacing */
    border: 3px solid var(--border);
    cursor: pointer; /* Add cursor pointer to indicate clickable headers */
  }

  td {
    background-color: var(--background-2);
    padding: 1rem;
    border: 3px solid var(--border);
    cursor: pointer;
    text-wrap: wrap; /* Ensure text wraps */
  }

  td.email {
    max-width: 200px; /* Adjust this value as needed */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    text-align: center;
    background: transparent;
    color: var(--text);
    transition: background-color 0.3s; /* Smooth transition */
  }

  th:hover {
    background-color: var(--primary); /* Highlight on hover */
  }

  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  button {
    color: var(--text);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
</style>
