<script lang="ts">
  export let students: Array<{
    studentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    section: string;
  }> = [];

  export let onStudentClick: (student: any) => void;
  export let onEditClick: (student: any) => void;
  export let onDeleteClick: (student: any) => void;

  let sortKey: string = "";
  let sortDirection: "asc" | "desc" = "asc";

  const sortBy = (key: string) => {
    if (sortKey === key) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortDirection = "asc";
    }

    students = [...students].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Prevent event bubbling for action buttons
  const handleActionClick = (e: Event) => {
    e.stopPropagation();
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
    {#each students as student (student.studentNumber)}
      <tr on:click={() => onStudentClick(student)}>
        <td>{student.studentNumber}</td>
        <td>{student.firstName}</td>
        <td>{student.lastName}</td>
        <td class="email">{student.email}</td>
        <td>{student.section}</td>
        <td class="actions">
          <button
            class="edit-btn"
            on:click|stopPropagation={() => onEditClick(student)}
          >
            Edit
          </button>
          <button
            class="delete-btn"
            on:click|stopPropagation={() => onDeleteClick(student)}
          >
            Delete
          </button>
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
    color: var(--text);
    background-color: var(--hover);
  }

  th,
  td {
    padding: 1rem;
    border: 1px solid var(--border);
  }

  th {
    text-align: center;
    background: transparent;
    color: var(--text-dark);
    transition: background-color 0.3s;
    cursor: pointer;
  }

  td {
    background-color: var(--background);
    border: 3px solid var(--border);
    cursor: pointer;
    text-wrap: wrap;
  }

  td.email {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th:hover {
    background-color: var(--hover);
  }

  tbody tr:hover {
    background-color: var(--active);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    white-space: nowrap;
  }

  .view-btn,
  .edit-btn,
  .delete-btn {
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s;
    border: 1px solid var(--border);
  }

  .view-btn {
    background-color: var(--background);
  }

  .edit-btn {
    background-color: var(--background);
  }

  .delete-btn {
    background-color: var(--background);
    color: #ef4444;
  }

  .view-btn:hover {
    background-color: var(--hover);
  }

  .edit-btn:hover {
    background-color: var(--hover);
  }

  .delete-btn:hover {
    background-color: #fee2e2;
  }
</style>
