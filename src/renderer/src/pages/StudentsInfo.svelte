<script lang="ts">
  import CustomTable from "../components/StudentTable.svelte";
  import { Modal, Button, Input, Label } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";

  type Student = {
    studentNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    section: string;
  };

  let students: Student[] = [];
  let selectedStudent: Student | null = null;
  let modalOpen = false;
  let deleteModalOpen = false;
  let editModalOpen = false;
  let confirmationInput = "";
  let editedStudent: Student | null = null;

  // Fetch students
  async function fetchStudents() {
    const response = await fetch("http://localhost:3000/teacher/studentsInfo");
    if (response.ok) {
      students = await response.json();
    } else {
      console.error("Failed to fetch students");
    }
  }

  // View student details
  const openModal = (student: Student) => {
    selectedStudent = student;
    modalOpen = true;
  };

  // Edit functions
  const openEditModal = (student: Student) => {
    editedStudent = { ...student };
    editModalOpen = true;
  };

  const handleEdit = async () => {
    if (!editedStudent) return;

    try {
      const response = await fetch(
        `http://localhost:3000/teacher/students/${editedStudent.studentNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedStudent),
        },
      );

      if (response.ok) {
        // Update local state
        students = students.map((student) =>
          student.studentNumber === editedStudent.studentNumber
            ? editedStudent
            : student,
        );
        editModalOpen = false;
        editedStudent = null;
      } else {
        alert("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student");
    }
  };

  // Delete functions
  const openDeleteModal = (student: Student) => {
    selectedStudent = student;
    deleteModalOpen = true;
    confirmationInput = "";
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    if (confirmationInput !== selectedStudent.studentNumber) {
      alert("Please enter the correct student number to confirm deletion");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/teacher/students/${selectedStudent.studentNumber}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Update local state
        students = students.filter(
          (student) => student.studentNumber !== selectedStudent.studentNumber,
        );
        deleteModalOpen = false;
        selectedStudent = null;
        confirmationInput = "";
      } else {
        alert("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  onMount(() => {
    fetchStudents();
  });
</script>

<div class="container" transition:slide={{ easing: cubicInOut, duration: 400 }}>
  <h1>Students Information</h1>
  <div class="table-container">
    <CustomTable
      {students}
      onStudentClick={openModal}
      onEditClick={openEditModal}
      onDeleteClick={openDeleteModal}
    />
  </div>
</div>

<!-- View Details Modal -->
<Modal
  title="Student Details"
  bind:open={modalOpen}
  autoclose
  class="modal-container bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg"
>
  {#if selectedStudent}
    <div class="modal-header text-xl font-bold">
      {selectedStudent.firstName}
      {selectedStudent.lastName}
    </div>
    <p><strong>Student Number:</strong> {selectedStudent.studentNumber}</p>
    <p><strong>Email:</strong> {selectedStudent.email}</p>
    <p><strong>Section:</strong> {selectedStudent.section}</p>
  {/if}
  <div slot="footer" class="modal-footer">
    <Button color="alternative" on:click={() => (modalOpen = false)}
      >Close</Button
    >
  </div>
</Modal>

<!-- Edit Modal -->
<Modal title="Edit Student" bind:open={editModalOpen} class="modal-container">
  {#if editedStudent}
    <div class="space-y-4">
      <div>
        <Label for="firstName">First Name</Label>
        <Input id="firstName" bind:value={editedStudent.firstName} />
      </div>
      <div>
        <Label for="lastName">Last Name</Label>
        <Input id="lastName" bind:value={editedStudent.lastName} />
      </div>
      <div>
        <Label for="email">Email</Label>
        <Input id="email" bind:value={editedStudent.email} />
      </div>
      <div>
        <Label for="section">Section</Label>
        <Input id="section" bind:value={editedStudent.section} />
      </div>
    </div>
    <div class="modal-footer">
      <Button color="alternative" on:click={() => (editModalOpen = false)}
        >Cancel</Button
      >
      <Button color="primary" on:click={handleEdit}>Save Changes</Button>
    </div>
  {/if}
</Modal>

<!-- Delete Confirmation Modal -->
<Modal
  title="Confirm Deletion"
  bind:open={deleteModalOpen}
  class="modal-container"
>
  {#if selectedStudent}
    <div class="space-y-4">
      <p class="text-red-500">Warning: This action cannot be undone!</p>
      <p>
        To confirm deletion, please enter the student number: <strong
          >{selectedStudent.studentNumber}</strong
        >
      </p>
      <Input
        type="text"
        bind:value={confirmationInput}
        placeholder="Enter student number to confirm"
      />
    </div>
    <div class="modal-footer">
      <Button color="alternative" on:click={() => (deleteModalOpen = false)}
        >Cancel</Button
      >
      <Button color="red" on:click={handleDelete}>Delete Student</Button>
    </div>
  {/if}
</Modal>

<style>
  h1 {
    margin-bottom: 2rem;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: bold;
    background: var(--background);
    width: fit-content;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
  }

  .table-container {
    max-height: 70vh;
    overflow-y: auto;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  :global(.modal-container) {
    max-width: 500px;
  }
</style>
