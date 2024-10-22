<script lang="ts">
  import { onMount } from "svelte";
  import {
    TrashBinSolid,
    CheckCircleSolid,
    CloseCircleSolid,
  } from "flowbite-svelte-icons";
  import { Tooltip, Toast, Modal, Label, Input } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";

  interface Assessment {
    id: number;
    title: string;
    description: string;
    questions: any;
    timeLimit?: string | number;
  }

  let timeLimit = "60";
  let assessments: Assessment[] = [];
  let expandedStates: boolean[] = [];
  let showDeletePopup = false;
  let selectedAssessmentIndex: number | null = null;
  let socket: WebSocket;
  let toastMessage: any;
  let distributeOptionsModal = false;
  let distributeAssessmentModal = false;

  onMount(() => {
    loadSavedAssessments();
    initializeWebSocket();
  });

  function initializeWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) return;

    socket = new WebSocket(`ws://localhost:8080/ws`);
    socket.onopen = () => console.log("WebSocket is open now.");
    socket.onclose = () => showToast("WebSocket connection closed", "error");
    socket.onerror = (error) =>
      showToast("WebSocket connection error", "error");
  }

  type Question = {
    id: number;
    type: string;
    content: string;
    required: boolean;
    options?: string[];
    correctAnswer?: number;
    correctAnswers?: number[];
    answer?: string;
  };

  function distributeAssessment(index: number) {
    const assessment = assessments[index];

    if (!assessment || !assessment.questions) {
      showToast("Invalid assessment selected", "error");
      return;
    }

    // Parse the questions if they are in string format
    let questions: Question[];
    try {
      questions = JSON.parse(assessment.questions);
    } catch (error) {
      console.error("Error parsing questions:", error);
      showToast("Failed to parse assessment questions.", "error");
      return;
    }

    const assessmentData = {
      type: "newAssessment",
      assessment: {
        title: assessment.title,
        description: assessment.description,
        questions: questions, // Parsed questions
        timeLimit: timeLimit,
      },
    };

    console.log("Distributing assessment", assessmentData);
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(assessmentData));
        distributeAssessmentModal = false;
        showToast("Assessment distributed successfully", "success");
      } catch (error) {
        console.error("Error sending assessment:", error);
        showToast(
          "Failed to distribute assessment. Please try again.",
          "error",
        );
      }
    } else {
      showToast(
        "Failed to distribute assessment. WebSocket is not open.",
        "error",
      );
    }
  }

  function showToast(message: string, type: "success" | "error") {
    toastMessage = { message, type };
    setTimeout(() => (toastMessage = null), 3000);
  }

  async function loadSavedAssessments() {
    try {
      const response = await fetch(
        "http://localhost:3000/assessments/assessments",
      );
      assessments = await response.json();
      expandedStates = new Array(assessments.length).fill(false);
    } catch (error) {
      showToast("Failed to load assessments", "error");
    }
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
        toggleDeletePopup(null);
      }
    }
  }

  function toggleDescription(index: number) {
    expandedStates[index] = !expandedStates[index];
  }

  function toggleDeletePopup(index: number | null) {
    selectedAssessmentIndex = index;
    showDeletePopup = !showDeletePopup;
  }

  function toggleDistributeAssessmentModal(index: number) {
    selectedAssessmentIndex = index;
    distributeOptionsModal = true;
  }

  function confirmDistribution() {
    distributeOptionsModal = false;
    distributeAssessmentModal = true;
  }
</script>

<div class="container" transition:slide={{ easing: cubicInOut, delay: 250 }}>
  <h1>Saved Assessments</h1>

  <div class="saved-assessments">
    {#each assessments as assessment, index}
      <div class="assessment-card">
        <div class="header">
          <h2>{assessment.title}</h2>
          <button class="delete" on:click={() => toggleDeletePopup(index)}>
            <TrashBinSolid />
          </button>
          <Tooltip>Delete Assessment</Tooltip>
        </div>

        {#if expandedStates[index]}
          <div class="description">{@html assessment.description}</div>
        {/if}

        <div class="separator"></div>
        <div class="assessment-controls">
          <button on:click={() => toggleDescription(index)}>
            {expandedStates[index] ? "Hide Details" : "Show Details"}
          </button>
          <button on:click={() => toggleDistributeAssessmentModal(index)}
            >Distribute</button
          >
        </div>
      </div>
    {/each}
  </div>
</div>

{#if toastMessage}
  <Toast
    color={toastMessage.type === "success"
      ? "green"
      : toastMessage.type === "error"
        ? "red"
        : "blue"}
    position="top-right"
    class="z-50 fixed top-4 right-4"
  >
    <svelte:fragment slot="icon">
      {#if toastMessage.type === "success"}
        <CheckCircleSolid class="w-5 h-5" />
      {/if}
      {#if toastMessage.type === "error"}
        <CloseCircleSolid class="w-5 h-5" />
      {/if}
      <span class="sr-only">Notification icon</span>
    </svelte:fragment>
    {toastMessage.message}
  </Toast>
{/if}

{#if showDeletePopup}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white p-4 rounded-lg border border-white shadow-lg">
      <h2 class="text-xl font-bold">
        Are you sure you want to delete this assessment?
      </h2>
      <div class="flex justify-center gap-4 mt-4">
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-lg"
          on:click={deleteSavedAssessment}>Yes</button
        >
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-lg"
          on:click={() => toggleDeletePopup(null)}>No</button
        >
      </div>
    </div>
  </div>
{/if}

{#if distributeOptionsModal}
  <Modal open={distributeOptionsModal} size="md" autoclose={false}>
    <div class="flex flex-col space-y-6">
      <h3 class="text-xl font-medium">Set Assessment Options</h3>
      <Label>
        <span>Time Limit (in minutes)</span>
        <Input type="number" bind:value={timeLimit} placeholder="60 Minutes" />
      </Label>
      <div class="flex justify-between">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded"
          on:click={confirmDistribution}>Continue</button
        >
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded"
          on:click={() => (distributeOptionsModal = false)}>Close</button
        >
      </div>
    </div>
  </Modal>
{/if}

{#if distributeAssessmentModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white p-4 rounded-lg border border-white shadow-lg">
      <h2 class="text-xl font-bold">
        Are you sure you want to distribute this assessment?
      </h2>
      <p class="mt-2">Time limit: {timeLimit} minutes</p>
      <div class="flex justify-center gap-4 mt-4">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg"
          on:click={() => distributeAssessment(selectedAssessmentIndex)}
          >Yes</button
        >
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-lg"
          on:click={() => (distributeAssessmentModal = false)}>No</button
        >
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .container {
    h1 {
      margin-bottom: 1rem;
      color: var(--text);
      font-size: 1.5rem;
      font-weight: bold;
      background: var(--background);
      width: fit-content;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      box-shadow: var(--shadow);
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
    background: var(--background);
    border: 1px solid var(--border);
    backdrop-filter: blur(4px);
    border-radius: 0.5rem;
    box-shadow: var(--shadow);
    & .description {
      max-height: none; /* Allow full height when expanded */
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-size: 1.2rem;
      font-weight: bold;
    }
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
    button {
      padding: 0.5rem 1rem;
      background-color: var(--background);
      border-radius: 0.2rem;
      border: 1px solid var(--border);
    }
  }
</style>
