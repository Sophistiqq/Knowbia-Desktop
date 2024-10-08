<script lang="ts">
  import { onMount } from "svelte";
  import { dndzone } from "svelte-dnd-action";
  import { Tooltip, Modal, Label, Input, Toast } from "flowbite-svelte";
  import {
    FileCopySolid,
    TrashBinSolid,
    CheckCircleSolid,
    CloseCircleSolid,
  } from "flowbite-svelte-icons";
  import DynamicAnswerField from "../components/DynamicAnswerField.svelte";
  import { debounce } from "../utils/debounce";
  import Quill from "quill";
  import "quill/dist/quill.bubble.css";
  import { slide } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  let socket: WebSocket;
  export let formModal = false;

  let toastMessage: {
    message: string;
    type: "success" | "error";
  } | null = null;
  function showToast(message: string, type: "success" | "error") {
    toastMessage = { message, type };
    setTimeout(() => {
      toastMessage = null;
    }, 3000); // Adjust the display time as needed
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

  let title = "";
  let description = "";
  let questions: Question[] = [
    {
      id: 1,
      type: "Short Answer",
      content: "",
      required: false,
      answer: "",
      options: [],
      correctAnswer: undefined,
      correctAnswers: [],
    },
  ];
  let shuffleQuestions = false;
  let shuffleAnswers = false;
  let timeLimit = "";

  let quill: Quill;

  onMount(() => {
    loadFromLocalStorage();
    loadSavedAssessments();
    initializeWebSocket();
    initializeQuillEditor();
  });

  // ---------- Distribute Assessment Functions -----------
  function initializeWebSocket() {
    let ip = window.location.hostname;
    console.log("Connecting to WebSocket at:", ip);
    socket = new WebSocket(`ws://${ip}:8080/ws`);

    socket.onopen = function () {
      console.log("WebSocket is open now.");
      showToast("WebSocket connection established", "success");
    };

    socket.onmessage = function (event) {
      console.log(`Message from server: ${event.data}`);
    };

    socket.onclose = function () {
      console.log("WebSocket is closed now.");
      showToast("WebSocket connection closed", "error");
      // Optional: Implement reconnection logic here
    };

    socket.onerror = function (error) {
      console.error("WebSocket error:", error);
      showToast("WebSocket connection error", "error");
    };
  }

  function distributeAssessment() {
    // Create a deep copy of the questions
    let distributedQuestions = JSON.parse(JSON.stringify(questions));

    // Shuffle questions if the shuffleQuestions toggle is true
    if (shuffleQuestions) {
      distributedQuestions = distributedQuestions.sort(
        () => Math.random() - 0.5,
      );
    }

    const assessmentData = {
      type: "newAssessment",
      assessment: {
        title,
        description,
        questions: distributedQuestions,
        timeLimit,
      },
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(assessmentData));
        showToast("Assessment distributed successfully", "success");
        distributeModal = false; // Close modal after success
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

  setInterval(initializeWebSocket, 30000); // Send a ping every 30 seconds

  // Editor config
  function initializeQuillEditor() {
    setTimeout(() => {
      quill = new Quill("#editor", {
        theme: "bubble",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            ["link"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
      });

      quill.root.innerHTML = description;

      const debouncedAdjustEditorHeight = debounce(adjustEditorHeight, 100);
      const debouncedSaveDescription = debounce((content: string) => {
        description = content;
        saveToLocalStorage();
      }, 300);

      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        debouncedSaveDescription(content);
        debouncedAdjustEditorHeight();
      });

      adjustEditorHeight();
    }, 0);
  }
  function updateQuillContent(content: string) {
    if (quill) {
      quill.root.innerHTML = content;
      adjustEditorHeight();
      saveToLocalStorage();
    }
  }

  function adjustEditorHeight() {
    const editorContainer = document.querySelector("#editor") as HTMLElement;
    editorContainer.style.height = "auto";
    editorContainer.style.height = `${editorContainer.scrollHeight}px`;
  }

  const debouncedSaveToLocalStorage = debounce(saveToLocalStorage, 100);

  function resetQuestionData(question: Question) {
    question.correctAnswer = undefined;
    question.correctAnswers = [];
    question.options = [];
    question.answer = "";
  }

  function addQuestion() {
    const newQuestion = {
      id: questions.length + 1,
      type: "Short Answer",
      content: "",
      required: true,
      answer: "",
      options: [],
      correctAnswer: undefined,
      correctAnswers: [],
    };
    resetQuestionData(newQuestion);
    questions = [...questions, newQuestion];
    debouncedSaveToLocalStorage();
  }

  function duplicateQuestion(index: number) {
    const duplicatedQuestion = {
      ...questions[index],
      id: questions.length + 1,
    };
    resetQuestionData(duplicatedQuestion);
    questions = [
      ...questions.slice(0, index + 1),
      duplicatedQuestion,
      ...questions.slice(index + 1),
    ];
    debouncedSaveToLocalStorage();
  }

  function removeQuestion(index: number) {
    questions = questions.filter((_, i) => i !== index);
    debouncedSaveToLocalStorage();
  }

  function handleDnd(event: CustomEvent<{ items: Question[] }>) {
    questions = event.detail.items;
    debouncedSaveToLocalStorage();
  }

  // Modify the saveToLocalStorage function to include the current description
  function saveToLocalStorage() {
    const assessmentData = {
      title,
      description: quill ? quill.root.innerHTML : description,
      questions,
    };
    localStorage.setItem("quiz-assessment", JSON.stringify(assessmentData));
  }

  function loadFromLocalStorage() {
    const savedData = localStorage.getItem("quiz-assessment");
    if (savedData) {
      const {
        title: savedTitle,
        description: savedDescription,
        questions: savedQuestions,
      } = JSON.parse(savedData);
      title = savedTitle || "";
      description = savedDescription || "";
      questions = savedQuestions || [];
    }
  }

  let showResetModal = false;

  function resetStorage() {
    localStorage.removeItem("quiz-assessment");
    questions = [];
    title = "";
    description = "";
    showResetModal = false;
    showToast("Assessment reset successfully", "success"); // Show Toast on reset
  }

  function cancelReset() {
    showResetModal = false;
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    debouncedSaveToLocalStorage();
  }

  function handleTitleInput(event: Event) {
    title = (event.target as HTMLTextAreaElement).value;
    debouncedSaveToLocalStorage();
  }

  function saveAssessmentAsFile() {
    const safeTitle = title.replace(/\s+/g, "_").replace(/[<>:"/\\|?*]/g, "");
    const filename = `${safeTitle || "assessment"}.json`;
    const dataStr = JSON.stringify({ title, description, questions }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Modify the save function to save assessments with unique keys
  function saveAssessment() {
    saveToLocalStorage();
    const assessmentData = { title, description, questions };
    const safeTitle = title.replace(/\s+/g, "_").replace(/[<>:"/\\|?*]/g, "");
    localStorage.setItem(
      `assessment_${safeTitle}`,
      JSON.stringify(assessmentData),
    );
    loadSavedAssessments(); // Reload saved assessments after saving
    showToast("Assessment saved successfully", "success"); // Show Toast on successful save
  }

  function resetAssessment() {
    showResetModal = true;
  }

  function loadFromJsonFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target.result as string;
            const {
              title: savedTitle,
              description: savedDescription,
              questions: savedQuestions,
            } = JSON.parse(content);
            title = savedTitle || "";
            description = savedDescription || "";
            questions = savedQuestions || [];
            debouncedSaveToLocalStorage();

            // Trigger success Toast
            showToast("Assessment loaded successfully", "success");
          } catch (error) {
            // Trigger error Toast
            showToast("Failed to load assessment", "error");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  // saving assessments in local local storage

  let savedAssessments: {
    title: string;
    description: string;
    questions: Question[];
  }[] = [];

  // Function to load all saved assessments from localStorage
  function loadSavedAssessments() {
    const assessments = Object.keys(localStorage)
      .filter((key) => key.startsWith("assessment_"))
      .map((key) => JSON.parse(localStorage.getItem(key) || "{}"));

    savedAssessments = assessments;
    console.log("Saved assessments:", savedAssessments);
  }

  // scripts for loading saved assessments

  let showSavedAssessmentsModal = false;

  function loadFromSavedAssessments() {
    showSavedAssessmentsModal = true;
  }

  function loadSavedAssessment(index: number) {
    const {
      title: savedTitle,
      description: savedDescription,
      questions: savedQuestions,
    } = savedAssessments[index];
    title = savedTitle || "";
    description = savedDescription || "";
    questions = savedQuestions || [];
    debouncedSaveToLocalStorage();
    updateQuillContent(savedDescription);
    showSavedAssessmentsModal = false;
    showToast("Assessment loaded successfully", "success"); // Show Toast on successful load
  }
  // Update the reactive statement
  $: if (quill && description !== quill.root.innerHTML) {
    updateQuillContent(description);
  }

  function deleteSavedAssessment(index: number) {
    const { title: savedTitle } = savedAssessments[index];
    localStorage.removeItem(`assessment_${savedTitle}`);
    loadSavedAssessments();
  }

  let distributeModal = false;

  function openDistributeModal() {
    distributeModal = true;
  }
</script>

<div class="container" transition:slide={{ duration: 500, easing: cubicInOut }}>
  <div class="create-quiz">
    <div class="top">
      <h1>Create an Assessment</h1>
      <div class="reset-load">
        <button on:click={resetAssessment}>Reset</button>
        <Tooltip placement="left">Reset the assessment</Tooltip>
        <button on:click={loadFromSavedAssessments}>Load: List</button>
        <Tooltip placement="left">Load from saved assessments</Tooltip>
        <button on:click={loadFromJsonFile}>Load: File</button>
        <Tooltip placement="left">Load from JSON file</Tooltip>
      </div>
    </div>
    <div class="separator"></div>
    <h1>Title</h1>
    <textarea
      bind:value={title}
      placeholder="Title"
      rows="1"
      on:input={handleTitleInput}
      style="overflow: hidden; resize: none; border: 2px solid var(--text)"
    ></textarea>
    <h2 class="font-bold">Description</h2>
    <div class="editor-wrapper">
      <div id="editor" style="height: auto;"></div>
    </div>
    <div class="separator"></div>
    <div class="assessment-controls">
      <div class="shuffle-questions">
        <input
          type="checkbox"
          id="shuffle-questions"
          bind:value={shuffleQuestions}
        />
        <label for="shuffle-questions">Shuffle Questions</label>
      </div>
    </div>
  </div>

  <div
    class="questions-list rounded-lg"
    use:dndzone={{ items: questions, flipDurationMs: 300 }}
    on:consider={handleDnd}
    on:finalize={handleDnd}
  >
    {#each questions as question, index (question.id)}
      <div class="question-container">
        <div class="question">
          <textarea
            bind:value={question.content}
            placeholder="Question"
            rows="1"
            on:input={handleInput}
            style="overflow: hidden; resize: none;"
          ></textarea>
          <select
            bind:value={question.type}
            name="question-type"
            id="question-type"
            on:change={saveToLocalStorage}
          >
            <option value="Short Answer">Short Answer</option>
            <option value="Paragraph">Paragraph</option>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Dropdown">Dropdown</option>
            <option value="Checkboxes">Checkboxes</option>
            <option value="Date">Date</option>
            <option value="Time">Time</option>
          </select>

          <DynamicAnswerField {question} onSave={debouncedSaveToLocalStorage} />

          <div class="text-question-controls">
            <div class="question-number">
              <p>{question.id}</p>
            </div>
            <div class="required-toggle">
              <input
                type="checkbox"
                bind:checked={question.required}
                on:change={saveToLocalStorage}
              />
              <p>Required</p>
            </div>
            <button on:click={() => duplicateQuestion(index)}>
              <FileCopySolid />
            </button>
            <Tooltip>Duplicate</Tooltip>
            <button on:click={() => removeQuestion(index)}>
              <TrashBinSolid />
            </button>
            <Tooltip>Remove</Tooltip>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <button on:click={addQuestion} class="add-question">Add Question</button>
  <div class="assessments-button-container">
    <button on:click={openDistributeModal} class="distribute-assessment"
      >Distribute</button
    >
    <button on:click={saveAssessment} class="save-assessment">Save</button>
  </div>
  <button on:click={saveAssessmentAsFile} class="add-question"
    >Save as JSON</button
  >
</div>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
  <div class="flex flex-col space-y-6 backdrop-blur-sm">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Add a link
    </h3>
    <Label class="space-y-2">
      <span>Text to display</span>
      <Input
        type="text"
        name="display-text"
        placeholder="Enter the text to display"
      />
    </Label>
    <Label class="space-y-2">
      <span>URL</span>
      <Input type="url" name="url" placeholder="Enter the link URL" />
    </Label>
    <div class="flex justify-end">
      <button
        type="button"
        class="bg-blue-500 text-white px-4 py-2 rounded"
        on:click={() => (formModal = false)}
      >
        Add Link
      </button>
    </div>
  </div>
</Modal>

<Modal bind:open={showResetModal} size="xs" autoclose={false} class="w-full">
  <div class="flex flex-col space-y-6 backdrop-blur-sm">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Reset Assessment
    </h3>
    <p>Are you sure you want to reset the assessment?</p>
    <div class="flex justify-between">
      <button
        type="button"
        class="bg-red-500 text-white px-4 py-2 rounded"
        on:click={resetStorage}
      >
        Yes, Reset
      </button>
      <button
        type="button"
        class="bg-gray-300 text-gray-900 px-4 py-2 rounded"
        on:click={cancelReset}
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>

<Modal
  bind:open={showSavedAssessmentsModal}
  size="lg"
  autoclose={false}
  class="w-full z-100"
>
  <h3 class="mb-4 text-xl font-medium" style="color: var(--text);">
    Saved Assessments
  </h3>

  <div class="flex flex-col space-y-4">
    {#each savedAssessments as assessment, index}
      <div class="flex justify-between items-center">
        <h4 style="color: var(--text);">{assessment.title}</h4>
        <div class="flex gap-4">
          <button
            type="button"
            class="px-4 py-2 rounded"
            style="background-color: var(--primary); color: var(--text);"
            on:click={() => loadSavedAssessment(index)}
          >
            Load
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded"
            style="background-color: var(--accent); color: var(--text);"
            on:click={() => deleteSavedAssessment(index)}
          >
            Delete
          </button>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex justify-end">
    <button
      type="button"
      class="px-4 py-2 rounded"
      style="background-color: var(--secondary); color: var(--text);"
      on:click={() => (showSavedAssessmentsModal = false)}
    >
      Close
    </button>
  </div>
</Modal>
<!-- Show Toast based on toastMessage -->
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

<Modal
  bind:open={distributeModal}
  size="md"
  autoclose={false}
  class="w-full border-2 border-[--text] bg-[--background-2]"
>
  <div class="flex flex-col space-y-6 backdrop-blur-sm">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Set Assessment Options
    </h3>
    <Label class="space-y-2">
      <span>Time Limit (in minutes)</span>
      <Input
        type="number"
        name="time-limit"
        placeholder="60 Minutes"
        class="border-2 border-[--text]"
        bind:value={timeLimit}
      />
    </Label>
    <div class="flex justify-between">
      <button
        type="button"
        class="bg-blue-500 text-white px-4 py-2 rounded border-2 border-[--text]"
        style="box-shadow: 4px 4px 0px var(--border);"
        on:click={distributeAssessment}
      >
        Distribute Now
      </button>
      <button
        type="button"
        class="bg-[--secondary] text-gray-900 px-4 py-2 rounded"
        style="box-shadow: 4px 4px 0px var(--border);"
        on:click={() => (distributeModal = false)}
      >
        Close
      </button>
    </div>
  </div>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .create-quiz {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    color: var(--text);
    background-color: white;
    backdrop-filter: blur(4px);
    border: 3px solid var(--text);
    box-shadow: 4px 6px 0px 0px var(--text);
    border-radius: 0.5rem;
    gap: 1rem;
    & h1 {
      font-size: 2rem;
      font-weight: bold;
    }
  }

  .question-container {
    background-color: white;
    border: 3px solid var(--text);
    border-radius: 0.5rem;
    box-shadow: 4px 6px 0px 0px var(--text);
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .question {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  textarea {
    padding: 0.5rem;
    width: 100%;
    border: 2px solid var(--text);
    box-shadow: 4px 3px 0px 0px var(--border);
    margin-bottom: 0.5rem;
    border-radius: 0.3rem;
    color: var(--text);
    transition: border-bottom 0.3s;
    min-height: 2rem;
    line-height: 1.5; /* Adjust line-height if needed */
    resize: none; /* Disable manual resizing */
    overflow: hidden; /* Let JS handle the overflow */
  }

  .text-question-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    & button {
      padding: 0.3rem 0.5rem;
      border: none;
      color: var(--text);
      transition: background-color 0.3s;
      border-radius: 0.3rem;
      cursor: pointer;
      border: 2px solid var(--border);
      &:hover {
        background-color: var(--accent);
      }
    }
  }

  .required-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text);
    margin-right: auto;
    & input[type="checkbox"] {
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid var(--border);
      outline: none;
      cursor: pointer;
      color: var(--text);
      &:checked {
        background-color: var(--accent);
      }
    }
  }

  .add-question {
    padding: 0.5rem 1rem;
    background-color: var(--accent);
    box-shadow: 5px 7px 0px var(--border);
    color: var(--text);
    border: 2px solid var(--text);
    border-radius: 0.3rem;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    &:active {
      box-shadow: none;
      transform: translate(5px, 7px);
    }
  }

  #question-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid var(--text);
    box-shadow: 4px 3px 0px 0px var(--border);
    gap: 1rem;
    color: var(--text);
    border: 2px solid var(--text);
    border-radius: 0.3rem;
  }

  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .question-container {
    transition: transform 0.3s;
  }

  .assessments-button-container {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    & .distribute-assessment,
    .save-assessment {
      padding: 0.5rem 1rem;
      width: 100%;
      background-color: var(--secondary);
      color: var(--text);
      font-weight: bold;
      border: 2px solid var(--text);
      box-shadow: 5px 7px 0px var(--border);
      border-radius: 0.3rem;
      cursor: pointer;
      transition:
        background-color 0.5s,
        transform 0.5s,
        box-shadow 0.5s;
      &:active {
        background-color: var(--secondary);
        box-shadow: none;
        transform: translate(5px, 5px);
      }
    }
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .editor-wrapper {
    height: auto;
  }
  .reset-load {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
  }
  .question-number {
    padding: 0.5rem 1rem;
    background-color: var(--background);
    color: var(--text);
    border-radius: 0.3rem;
    text-align: center;
    border: 2px solid var(--border);
  }
  .separator {
    height: 3px;
    background-color: var(--text);
  }

  .assessment-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    & > div {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    & input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      border: 2px solid var(--border);
      outline: none;
      cursor: pointer;
      color: var(--text);
      &:checked {
        background-color: var(--accent);
      }
    }
  }
  #editor {
    border: 2px solid var(--text);
    border-radius: 0.3rem;
    box-shadow: 4px 3px 0px 0px var(--border);
  }
</style>
