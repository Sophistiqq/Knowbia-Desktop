<script lang="ts">
  import { onMount } from "svelte";
  import { Card, Table } from "flowbite-svelte";

  let assessments = [];
  let selectedAssessment = null;
  let studentResults = [];

  onMount(async () => {
    // Fetch assessments from the server
    const response = await fetch("/api/assessments");
    assessments = await response.json();
  });

  async function fetchStudentResults(assessmentId) {
    // Fetch student results for the selected assessment
    const response = await fetch(`/api/assessment-results/${assessmentId}`);
    studentResults = await response.json();
    selectedAssessment = assessments.find((a) => a.id === assessmentId);
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
          <Table striped={true}>
            <Table.Head>
              <Table.HeadCell>Student Number</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Score</Table.HeadCell>
              <Table.HeadCell>Date Taken</Table.HeadCell>
            </Table.Head>
            <Table.Body class="divide-y">
              {#each studentResults as result}
                <Table.Row>
                  <Table.Cell>{result.studentNumber}</Table.Cell>
                  <Table.Cell>{result.firstName} {result.lastName}</Table.Cell>
                  <Table.Cell>{result.score}</Table.Cell>
                  <Table.Cell
                    >{new Date(result.dateTaken).toLocaleString()}</Table.Cell
                  >
                </Table.Row>
              {/each}
            </Table.Body>
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
