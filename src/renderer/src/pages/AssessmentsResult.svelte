<script lang="ts">
  import { onMount } from "svelte";
  import { Card, Table } from "flowbite-svelte";

  let socket: WebSocket;
  let assessments = [];
  let selectedAssessment = null;
  let studentResults = [];

  // WebSocket server config
  let serverIp = window.location.hostname;
  let serverPort = 8080;
  let finishedAssessments = [];

  onMount(() => {
    // Establish WebSocket connection and request active assessments
    connectWebSocket();
    fetchFinishedAssessments();
  });

  function connectWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    socket = new WebSocket(`${protocol}://${serverIp}:${serverPort}/ws`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Handle receiving active assessments
      if (message.type === "activeAssessments") {
        assessments = message.assessments; // Update assessments array
        console.log("Active Assessments: ", assessments);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  // Fetch assessment results from backend
  async function fetchStudentResults(assessmentId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/assessments/assessments/${assessmentId}/results`,
      );
      studentResults = await response.json();
      selectedAssessment = assessments.find((a) => a.id === assessmentId);
      console.log("Student Results: ", studentResults);
    } catch (error) {
      console.error("Failed to fetch student results: ", error);
    }
  }

  // Fetch finished assessments from backend
  async function fetchFinishedAssessments() {
    try {
      const response = await fetch(
        "http://localhost:3000/assessments/finished",
      );
      finishedAssessments = await response.json();
      console.log("Finished Assessments: ", finishedAssessments);
    } catch (error) {
      console.error("Failed to fetch finished assessments: ", error);
    }
  }
</script>

<Card>
  <h2 class="text-lg font-bold">Active Assessments</h2>
  <ul>
    {#each assessments as assessment}
      <li>
        <button on:click={() => fetchStudentResults(assessment.id)}>
          {assessment.title}
        </button>
      </li>
    {/each}
  </ul>
</Card>
<Card>
  <!-- Finished Assessments List -->
  <h2 class="text-lg font-bold">Finished Assessments</h2>
  <ul>
    {#each finishedAssessments as assessment}
      <li>
        <button on:click={() => fetchStudentResults(assessment.id)}>
          {assessment.title}
        </button>
      </li>
    {/each}
  </ul>
</Card>

{#if selectedAssessment}
  <Card>
    <h2 class="text-lg font-bold">Results for: {selectedAssessment.title}</h2>
    <Table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {#each studentResults as result}
          <tr>
            <td>{result.studentName}</td>
            <td>{result.score}</td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </Card>
{/if}
