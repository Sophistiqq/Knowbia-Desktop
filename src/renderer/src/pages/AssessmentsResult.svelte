<script lang="ts">
  import { onMount } from "svelte";

  let socket: WebSocket;
  let assessments = [];
  let selectedAssessment = null;
  let studentResults = [];

  // WebSocket server config
  let serverIp = "localhost";
  let serverPort = 8080;
  let finishedAssessments = [];

  onMount(() => {
    // Establish WebSocket connection and request active assessments
    connectWebSocket();
    fetchFinishedAssessments();
  });

  function connectWebSocket() {
    socket = new WebSocket(`ws://${serverIp}:${serverPort}/ws`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Handle receiving active assessments
      if (message.type === "activeAssessments") {
        assessments = message.assessments; // Update assessments array
        console.log("Assessments: ", assessments);
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
  function formatDate(isoString: string) {
    const date = new Date(isoString);

    // Extract parts of the date
    const hours = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2); // Last 2 digits of the year

    // Return the formatted string in the desired order
    return `${hours} ${month} ${day}, ${year}`;
  }
</script>

<div class="active-assessments-wrapper">
  <h2 class="text-lg font-bold">Ongoing Assessments</h2>
  <div class="separator"></div>
  <ul>
    {#each assessments as assessment}
      <li>
        <button on:click={() => fetchStudentResults(assessment.id)}>
          {assessment.title}
        </button>
      </li>
    {/each}
  </ul>
</div>

<div class="finised-assessments-wrapper">
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
</div>
<div class="results-display">
  {#if selectedAssessment}
    <h2 class="text-lg font-bold">Results for: {selectedAssessment.title}</h2>
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Last Name</th>
          <th>Score</th>
          <th>Submitted at</th>
        </tr>
      </thead>
      <tbody>
        {#each studentResults as result}
          <tr>
            <td>{result.student_number}</td>
            <td>{result.lastName}</td>
            <td>{result.score}</td>
            <td>{formatDate(result.created_at)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>No assessment selected</p>
  {/if}
</div>

<style lang="scss">
  .active-assessments-wrapper,
  .finised-assessments-wrapper,
  .results-display {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--background);
    border: 3px solid var(--border);
    box-shadow: 6px 8px 0px 0px var(--border);
    border-radius: 0.5rem;
    padding: 1rem;
    h2 {
      margin-bottom: 0.5rem;
    }
  }
  table {
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
  .separator {
    height: 2px;
    background: var(--text);
    margin-block: 0.5rem;
  }
</style>
