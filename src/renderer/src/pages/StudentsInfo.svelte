<script lang="ts">
  import CustomTable from "../components/StudentTable.svelte"; // Import the custom table component
  import { Modal, Button } from "flowbite-svelte";

  // Define Student type
  type Student = {
    id: number;
    student_number: string;
    firstname: string;
    lastname: string;
    email: string;
    phone_number?: string;
    year_level?: string;
    section?: string;
    verified: boolean;
    birthday?: string;
  };

  // Function to generate fake students
  function generateFakeStudents(num) {
    const students = [];
    const names = [
      "John",
      "Jane",
      "Alex",
      "Emily",
      "Chris",
      "Katie",
      "Michael",
      "Sarah",
      "David",
      "Laura",
    ];

    for (let i = 1; i <= num; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLastName = names[Math.floor(Math.random() * names.length)];
      students.push({
        id: i,
        student_number: `S${String(i).padStart(4, "0")}`, // e.g., S0001
        firstname: randomName,
        lastname: randomLastName,
        email: `${randomName.toLowerCase()}.${randomLastName.toLowerCase()}@example.com`,
        phone_number: `09${Math.floor(Math.random() * 90000000) + 10000000}`, // e.g., 09123456789
        year_level: `Year ${Math.floor(Math.random() * 4) + 1}`, // Random year between 1 and 4
        section: `Section ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`, // Sections A to E
        verified: Math.random() < 0.5, // Randomly verified or not
        birthday: new Date(
          2000 + Math.floor(Math.random() * 5),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28),
        )
          .toISOString()
          .split("T")[0], // Random birthday
      });
    }

    return students;
  }

  // Generate fake students
  export let students: Student[] = generateFakeStudents(10);
  let selectedStudent: Student | null = null;
  let modalOpen = false;

  const openModal = (student: Student) => {
    selectedStudent = student;
    modalOpen = true;
  };
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
      {selectedStudent.firstname}
      {selectedStudent.lastname}
    </div>
    <p><strong>Student Number:</strong> {selectedStudent.student_number}</p>
    <p><strong>Email:</strong> {selectedStudent.email}</p>
    <!-- Add more student details here -->
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
