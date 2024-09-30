<script lang="ts">
  import CustomTable from "../components/StudentTable.svelte"; // Import the custom table component
  import { Modal, Button } from "flowbite-svelte";
  import { onMount } from "svelte";

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
    const webSocket = new WebSocket("ws://localhost:8080"); // Connect to Electron WebSocket

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "STUDENT_DATA") {
        students = message.data; // Update your local state
      }
    };

    webSocket.onopen = () => {
      webSocket.send(JSON.stringify({ type: "getStudents" })); // Request student data
    };
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
    <div class="modal-header">
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
