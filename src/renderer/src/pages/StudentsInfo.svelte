<script lang="ts">
  import CustomTable from "../components/StudentTable.svelte"; // Import the custom table component
  import { Modal, Button } from "flowbite-svelte";
  import { onMount } from "svelte";
  import BgDesign from "../components/bg-design.svelte";

  // Define Student type
  type Student = {
    studentNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    section: string;
  };

  // In-memory store for students
  let students: Student[] = [];

  // Function to fetch students from the WebSocket
  async function fetchStudents() {
    // fetch students from the teacher route studentsInfo, not websocket
    const response = await fetch("http://localhost:3000/teacher/studentsInfo");
    if (response.ok) {
      students = await response.json();
    } else {
      console.error("Failed to fetch students");
    }
  }

  // Modal state
  let selectedStudent: Student | null = null;
  let modalOpen = false;

  const openModal = (student: Student) => {
    selectedStudent = student;
    modalOpen = true;
  };

  // Fetch students on component mount
  onMount(() => {
    fetchStudents();
  });
</script>

<BgDesign />

<div class="table-container">
  <CustomTable {students} onStudentClick={openModal} />
</div>

<Modal
  title="Student Details"
  bind:open={modalOpen}
  autoclose
  class="modal-container"
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
    <Button on:click={() => (modalOpen = false)}>Close</Button>
  </div>
</Modal>

<style>
  .table-container {
    max-height: 70vh;
    overflow-y: auto;
  }
</style>
