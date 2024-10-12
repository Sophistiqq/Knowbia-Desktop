<script lang="ts">
  // TODO: NEED TO FIX THE FETCHING OF ASSESSMENTS AND STUDENT RESULTS
  import { onMount } from "svelte";
  import { Card, Table } from "flowbite-svelte";

  let assessments = [];
  let selectedAssessment = null;
  let studentResults = [];

  onMount(async () => {
    // Fetch assessments from the server
    const response = await fetch(
      "http://localhost:3000/assessments/assessments",
    );
    assessments = await response.json();
    console.log(assessments);
  });

  async function fetchStudentResults(assessmentId: any) {
    // Fetch student results for the selected assessment
    const response = await fetch(
      `http://localhost:3000/assessments/assessments/${assessmentId}`,
    );
    studentResults = await response.json();
    selectedAssessment = assessments.find((a) => a.id === assessmentId);
    console.log(studentResults);
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Assessment Results</h1>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="col-span-1">
      <Card>
        <h2 class="text-xl font-semibold mb-2">Assessments</h2>
        <ul class="divide-y divide-gray-200">
          {#each assessments as assessment}
            <li>
              <button
                class="w-full text-left py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                on:click={() => fetchStudentResults(assessment.id)}
              >
                {assessment.title}
              </button>
            </li>
          {/each}
        </ul>
      </Card>
    </div>

    <div class="col-span-2">
      {#if selectedAssessment}
        <Card>
          <h2 class="text-xl font-semibold mb-2">
            {selectedAssessment.title} Results
          </h2>
          <Table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {#each studentResults as result}
                <tr>
                  <td>{result.studentId}</td>
                  <td>{result.studentName}</td>
                  <td>{result.score}</td>
                </tr>
              {/each}
            </tbody>
          </Table>
        </Card>
      {:else}
        <Card>
          <p class="text-gray-500">Select an assessment to view results</p>
        </Card>
      {/if}
    </div>
  </div>
</div>
