<script lang="ts">
  import { onMount } from "svelte";
  import { TrashBinSolid } from "flowbite-svelte-icons";
  import { Tooltip } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";

  type Assessment = {
    id: number;
    title: string;
    description: string;
    questions: {
      id: number;
      type: string;
      content: string;
      required: boolean;
      options?: string[];
      correctAnswer?: number;
      correctAnswers?: number[];
      answer?: string;
    }[];
  };

  let assessments: Assessment[] = [];
  let expandedStates: boolean[] = []; // Track expanded states
  let showDeletePopup = false;
  let selectedAssessmentIndex: number | null = null;

  onMount(() => {
    loadSavedAssessments();
  });

  async function loadSavedAssessments() {
    const response = await fetch(
      "http://localhost:3000/assessments/assessments",
    );
    assessments = await response.json();
    expandedStates = new Array(assessments.length).fill(false); // Initialize all to collapsed
  }

  async function deleteSavedAssessment() {
    if (selectedAssessmentIndex !== null) {
      const response = await fetch(
        `http://localhost:3000/assessments/assessments/${assessments[selectedAssessmentIndex].id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        assessments.splice(selectedAssessmentIndex, 1);
        expandedStates.splice(selectedAssessmentIndex, 1);
        loadSavedAssessments(); // Reload the assessments
        toggleDeletePopup(null); // Close the popup after deleting
      }
    }
  }

  function toggleDescription(index: number) {
    expandedStates[index] = !expandedStates[index]; // Toggle the state
  }

  function toggleDeletePopup(index: number | null) {
    selectedAssessmentIndex = index;
    showDeletePopup = !showDeletePopup;
  }
</script>

<div class="container" transition:slide={{ easing: cubicInOut, delay: 250 }}>
  <h1>Saved Assessments</h1>

  <div class="saved-assessments">
    {#each assessments as assessment, index}
      <div class="assessment-card" class:expand={expandedStates[index]}>
        <div class="header">
          <h2>{assessment.title}</h2>
          <button class="delete" on:click={() => toggleDeletePopup(index)}>
            <TrashBinSolid />
          </button>
          <Tooltip>Delete Assessment</Tooltip>
        </div>
        <div class="description">
          {@html assessment.description}
        </div>
        <div class="separator"></div>
        <div class="assessment-controls">
          <button on:click={() => toggleDescription(index)}>
            {expandedStates[index] ? "Collapse" : "Expand"}
          </button>
          <button>Start Assessment</button>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if showDeletePopup}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white p-4 rounded-lg">
      <h2 class="text-xl font-bold">
        Are you sure you want to delete this assessment?
      </h2>
      <div class="flex justify-center gap-4 mt-4">
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-lg"
          on:click={deleteSavedAssessment}
        >
          Yes
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-lg"
          on:click={() => toggleDeletePopup(null)}
        >
          No
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    & h1 {
      margin-bottom: 1rem;
      color: var(--text);
      font-size: 1.5rem;
      font-weight: bold;
      background: var(--secondary);
      width: fit-content;
      padding: 1rem;
      border: 2px solid var(--text);
      border-radius: 0.5rem;
      box-shadow: 6px 8px 0px 0px var(--border);
    }
  }
  .saved-assessments {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
  }
  .assessment-card {
    padding: 1.5rem;
    color: var(--text);
    background: white;
    border: 2px solid var(--text);
    backdrop-filter: blur(4px);
    border-radius: 0.5rem;
    box-shadow: 6px 8px 0px 0px var(--border);
    & .description {
      height: 2.5rem;
      overflow-y: auto; /* Prevent scroll when collapsed */
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & h2 {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }

  .expand {
    height: auto !important; /* Allow auto height when expanded */
  }

  .delete {
    background: none;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    color: var(--text);
    padding: 0.5rem;
    &:hover {
      background: var(--secondary);
    }
  }

  .separator {
    height: 1px;
    background: var(--text);
    margin-block: 1rem;
  }
  .assessment-controls {
    display: flex;
    justify-content: space-around;
    & button {
      padding: 0.5rem 1rem;
      background-color: var(--background);
      border-radius: 0.2rem;
      border: 1px solid var(--text);
      box-shadow: 4px 4px 0px var(--border);
    }
  }
</style>
