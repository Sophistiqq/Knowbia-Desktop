<script lang="ts">
  import { onMount } from "svelte";

  let assessments = [];
  let selectedAssessment = null;
  let studentResults = [];
  let finishedAssessments = [];
  // Modal state
  let showModal = false;
  let selectedRecord = null;
  let editScore = "";
  onMount(() => {
    fetchActiveAssessments();
    fetchFinishedAssessments();
  });

  // Fetch active assessments
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

  async function fetchFinishedAssessments() {
    try {
      const response = await fetch(
        "http://localhost:3000/assessments/finished",
      );
      finishedAssessments = await response.json();
      console.log("Finished Assessments: ", finishedAssessments);
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
    const hours = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${hours} ${month} ${day}, ${year}`;
  }

  function openModal(record: { score: { toString: () => string } }) {
    selectedRecord = record;
    editScore = record.score.toString();
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedRecord = null;
    editScore = "";
  }

  async function updateScore() {
    try {
      const response = await fetch(
        `http://localhost:3000/assessments/results/${selectedRecord.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: parseFloat(editScore) }),
        },
      );

      if (response.ok) {
        // Update the local state
        studentResults = studentResults.map((result) =>
          result.id === selectedRecord.id
            ? { ...result, score: parseFloat(editScore) }
            : result,
        );
        closeModal();
      } else {
        console.error("Failed to update score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  }

  async function deleteRecord() {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/assessments/results/${selectedRecord.id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          // Remove the record from local state
          studentResults = studentResults.filter(
            (result) => result.id !== selectedRecord.id,
          );
          closeModal();
        } else {
          console.error("Failed to delete record");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  }
</script>

<h1>Assessment Results</h1>
<div class="active-assessments-wrapper">
  <h2 class="text-lg font-bold">Ongoing Assessments</h2>
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
          <tr on:click={() => openModal(result)}>
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

{#if showModal}
  <div class="modal-overlay">
    <div class="modal">
      <h2>Edit Result</h2>
      <div class="modal-content">
        <p>Student: {selectedRecord.student_number}</p>
        <p>Name: {selectedRecord.lastName}</p>
        <div class="input-group">
          <label for="score">Score:</label>
          <input
            type="number"
            id="score"
            bind:value={editScore}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <div class="button-group">
          <button class="save-btn" on:click={updateScore}>Save Changes</button>
          <button class="delete-btn" on:click={deleteRecord}
            >Delete Record</button
          >
          <button class="cancel-btn" on:click={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
{/if}

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

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: var(--background);
    padding: 2rem;
    border-radius: 0.5rem;
    min-width: 300px;
    max-width: 500px;
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
    h2 {
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
    }
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    input {
      padding: 0.5rem;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      background: var(--background);
      color: var(--text);
    }
  }

  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background-color 0.3s;
      &:hover {
        background-color: var(--hover);
      }
    }

    .save-btn {
      color: white;
    }

    .delete-btn {
      color: white;
    }

    .cancel-btn {
      color: var(--button-text);
    }
  }

  tbody tr {
    cursor: pointer;
  }
</style>
