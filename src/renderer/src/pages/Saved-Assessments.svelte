<script lang="ts">
  import { onMount } from "svelte";
  import { TrashBinSolid } from "flowbite-svelte-icons";
  import { Tooltip } from "flowbite-svelte";

  type Assessment = {
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

  let savedAssessments: Assessment[] = [];
  let expandedStates: boolean[] = []; // Track expanded states

  onMount(() => {
    loadSavedAssessments();
  });

  function loadSavedAssessments() {
    const assessments = Object.keys(localStorage)
      .filter((key) => key.startsWith("assessment_"))
      .map((key) => JSON.parse(localStorage.getItem(key) || "{}"));

    savedAssessments = assessments;
    expandedStates = new Array(savedAssessments.length).fill(false); // Initialize all to collapsed
  }

  function deleteSavedAssessment(index: number) {
    const { title: savedTitle } = savedAssessments[index];
    localStorage.removeItem(`assessment_${savedTitle}`);
    loadSavedAssessments();
  }

  function toggleDescription(index: number) {
    expandedStates[index] = !expandedStates[index]; // Toggle the state
  }
</script>

<div class="container">
  <h1>Saved Assessments</h1>

  <div class="saved-assessments">
    {#each savedAssessments as assessment, index}
      <div class="assessment-card">
        <div class="header">
          <h2>{assessment.title}</h2>
          <button class="delete" on:click={() => deleteSavedAssessment(index)}>
            <TrashBinSolid size="md" />
          </button>
          <Tooltip>Remove</Tooltip>
        </div>
        <div class="separator"></div>
        <div class="description {expandedStates[index] ? 'expand' : ''}">
          {@html assessment.description}
        </div>

        <div class="separator"></div>
        <div class="assessment-controls">
          <button
            class="description-toggle"
            style="color: var(--text)"
            on:click={() => toggleDescription(index)}
          >
            {expandedStates[index] ? "Show Less" : "Show More"}
          </button>
          <button class="host" on:click={() => alert("Host")}> Host </button>
          <button>Save as File</button>
        </div>
      </div>
    {/each}
  </div>
</div>

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
