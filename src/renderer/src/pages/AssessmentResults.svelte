<script lang="ts">
  import { onMount } from "svelte";

  let assessments = [];
  let selectedAssessment = null;
  let studentResults = [];

  let finishedAssessments = [];

  onMount(() => {
    // Establish WebSocket connection and request active assessments
    fetchActiveAssessments();
    fetchFinishedAssessments();
  });

  async function fetchActiveAssessments() {
    try {
      const response = await fetch(
        "http://localhost:3000/distribution/assessments",
      );
      const data = await response.json();
      assessments = data.assessments;
    } catch (error) {
      console.error("Failed to fetch active assessments: ", error);
    }
  }

  // Fetch assessment results from backend

  async function fetchStudentResults(assessmentId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/assessments/assessments/${assessmentId}/results`,
      );
      studentResults = await response.json();
      selectedAssessment = assessments.find((a) => a.id === assessmentId);
      console.log("Selected Assessment: ", selectedAssessment);
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
      // if an assessment appeared in active assessments, remove it from finished assessments
      console.log("Assessments: ", assessments);
      assessments.forEach((assessment) => {
        finishedAssessments = finishedAssessments.filter(
          (a) => a.assessment_id !== assessment.id,
        );
      });
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

<h1>Assessment Results</h1>
<div class="active-assessments-wrapper">
  <h2 class="text-lg font-bold">Ongoing Assessments</h2>
  <div class="separator"></div>
  {#if assessments.length > 0}
    <ul>
      {#each assessments as assessment}
        <li>
          <button on:click={() => fetchStudentResults(assessment.id)}>
            {assessment.title}
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No Ongoing Assessment</p>
  {/if}
</div>

<div class="finised-assessments-wrapper">
  <!-- Finished Assessments List -->
  <h2 class="text-lg font-bold">Finished Assessments</h2>
  {#if finishedAssessments.length > 0}
    <ul>
      {#each finishedAssessments as assessment}
        <li>
          <button
            on:click={() => {
              studentResults = assessment.results;
              selectedAssessment = assessment;
              console.log("Selected Assessment: ", selectedAssessment);
            }}
          >
            {assessment.title}
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No Finished Assessment</p>
  {/if}
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
  .active-assessments-wrapper,
  .finised-assessments-wrapper,
  .results-display {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: var(--text);
    background-color: var(--background);
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    padding: 1rem;
    h2 {
      margin-bottom: 0.5rem;
    }
  }
  button {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background-color: var(--button-background);
    color: var(--button-text);
    border: 1px solid var(--border);
    border-radius: 0.2rem;
    text-align: left;
    cursor: pointer;
    width: fit-content;
    transition:
      background-color 0.3s,
      color 0.3s;
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
    border: 1px solid var(--text-dark);
  }

  td {
    background-color: var(--background);
    border: 1px solid var(--border);
    cursor: pointer;
    text-wrap: wrap;
  }

  th:hover {
    background-color: var(--primary); /* Highlight on hover */
  }

  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .separator {
    height: 1px;
    background: var(--border);
  }
</style>
