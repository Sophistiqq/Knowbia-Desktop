<script lang="ts">
  import { onMount } from "svelte";
  import { dndzone } from "svelte-dnd-action";
  import { Tooltip, Modal, Label, Input } from "flowbite-svelte";
  import { FileCopySolid, TrashBinSolid } from "flowbite-svelte-icons";
  import DynamicAnswerField from "../components/DynamicAnswerField.svelte";
  import { debounce } from "../utils/debounce"; // Debounce utility
  import Quill from "quill"; // Import Quill for the editor
  import "quill/dist/quill.bubble.css"; // Use the Bubble theme
  export let formModal = false;

  // Define the structure of questions array
  type Question = {
    id: number;
    type: string;
    content: string;
    required: boolean;
    options?: string[];
    correctAnswer?: number;
    correctAnswers?: number[]; // For checkboxes
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
      correctAnswer: 0,
      correctAnswers: [],
    },
  ];

  let quill: Quill; // Reference to Quill instance
  onMount(() => {
    loadFromLocalStorage();
    quill = new Quill("#editor", {
      theme: "bubble", // Set the theme to Bubble
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
    });

    // Set the initial content from description
    quill.root.innerHTML = description; // Ensure description is used here

    // Update the content and height when the editor changes
    quill.on("text-change", () => {
      description = quill.root.innerHTML;
      adjustEditorHeight(); // Call the function to adjust height
    });

    // Adjust height initially
    adjustEditorHeight();
  });

  // Function to adjust the height of the Quill editor
  function adjustEditorHeight() {
    const editorContainer: any = document.querySelector("#editor");
    if (editorContainer) {
      editorContainer.style.height = "auto"; // Reset height
      const newHeight = editorContainer.scrollHeight; // Get the scroll height
      editorContainer.style.height = `${newHeight}px`; // Set new height
    }
  }
  // Debounced save function for input fields
  const debouncedSaveToLocalStorage = debounce(() => {
    saveToLocalStorage();
  }, 300); // Save after 300ms delay

  // Function to add a new question
  function addQuestion() {
    questions = [
      ...questions,
      {
        id: questions.length + 1,
        type: "Short Answer",
        content: "",
        required: false,
        answer: "",
        options: [],
        correctAnswer: 0,
        correctAnswers: [],
      },
    ];
    saveToLocalStorage();
  }

  function duplicateQuestion(index: number) {
    const duplicatedQuestion = {
      ...questions[index],
      id: questions.length + 1,
    };
    questions = [
      ...questions.slice(0, index + 1),
      duplicatedQuestion,
      ...questions.slice(index + 1),
    ];
    saveToLocalStorage();
  }

  function removeQuestion(index: number) {
    questions = questions.filter((_, i) => i !== index);
    saveToLocalStorage();
  }

  function handleDnd(event: CustomEvent<{ items: Question[] }>) {
    questions = event.detail.items;
    saveToLocalStorage();
  }

  // Save questions and title/description to local storage
  function saveToLocalStorage() {
    const assessmentData = {
      title,
      description,
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
  }

  function cancelReset() {
    showResetModal = false;
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    debouncedSaveToLocalStorage(); // Debounced save
  }

  function handleTitleInput(event: Event) {
    title = (event.target as HTMLTextAreaElement).value;
    debouncedSaveToLocalStorage();
  }

  // New function to log assessment data
  function distributeAssessment() {
    const assessmentData = {
      title,
      description,
      questions,
    };

    console.log("Assessment Data to Distribute:", assessmentData);

    // Here you can add the logic to send `assessmentData` over the local network
  }

  // New function to save assessment data as a JSON file
  function saveAssessmentAsFile(assessmentData: object) {
    // Use the title for the filename, replace spaces with underscores
    const safeTitle = title.replace(/\s+/g, "_").replace(/[<>:"/\\|?*]/g, ""); // Remove unsafe characters
    const filename = `${safeTitle || "assessment"}.json`; // Default to 'assessment.json' if title is empty
    const dataStr = JSON.stringify(assessmentData, null, 2); // Pretty-print JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // Use the formatted filename
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release memory
  }

  // New function to handle saving assessment data
  function saveAssessment() {
    const assessmentData = {
      title,
      description,
      questions,
    };
    saveToLocalStorage(); // Save to local storage
    saveAssessmentAsFile(assessmentData); // Save as a JSON file
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
          const content = e.target.result as string;
          const {
            title: savedTitle,
            description: savedDescription,
            questions: savedQuestions,
          } = JSON.parse(content);
          title = savedTitle || "";
          description = savedDescription || "";
          questions = savedQuestions || [];
          saveToLocalStorage();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
</script>

<div class="container">
  <div class="create-quiz">
    <div class="top">
      <h1>Create an Assessment</h1>
      <div class="reset-load">
        <button on:click={resetAssessment}>Reset</button>
        <Tooltip placement="left">Reset the assessment</Tooltip>
        <button on:click={loadFromJsonFile}>Load</button>
        <Tooltip placement="left">Load from JSON file</Tooltip>
      </div>
    </div>
    <textarea
      bind:value={title}
      placeholder="Title"
      rows="1"
      on:input={handleTitleInput}
      style="overflow: hidden; resize: none;"
    ></textarea>
    <h2>Description</h2>
    <div class="editor-wrapper">
      <div id="editor" style="height: auto;"></div>
    </div>
  </div>

  <div
    class="questions-list"
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

          <DynamicAnswerField {question} />

          <div class="text-question-controls">
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
    <button on:click={distributeAssessment} class="distribute-assessment"
      >Distribute</button
    >
    <button on:click={saveAssessment} class="save-assessment">Save</button>
  </div>
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

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-inline: clamp(10vw, 5rem, 30vw);
  }

  .create-quiz {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    color: var(--text);
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    gap: 1rem;
    & h1 {
      font-size: 2rem;
    }
  }

  .question-container {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .question {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  textarea {
    padding: 0.5rem;
    width: 100%;
    border: none;
    border-radius: 0.3rem;
    background-color: var(--background);
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
      background-color: var(--background);
      color: var(--text);
      transition: background-color 0.3s;
      border-radius: 0.3rem;
      cursor: pointer;
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
      width: 1rem;
      height: 1rem;
      border: none;
      outline: none;
      cursor: pointer;
      background-color: var(--background);
      color: var(--text);
      &:checked {
        background-color: var(--accent);
      }
    }
  }

  .add-question {
    padding: 0.5rem 1rem;
    background-color: var(--border);
    color: var(--text);
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;
    &:hover {
      background-color: var(--accent);
      color: var(--background);
    }
  }

  #question-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    background-color: var(--background);
    color: var(--text);
    border: none;
    border-bottom: 3px solid var(--border);
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
      border: none;
      border-radius: 0.3rem;
      cursor: pointer;
      transition: background-color 0.3s;
      &:hover {
        background-color: var(--primary);
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
    border: 1px solid var(--border);
    background-color: var(--background);
    border-radius: 0.3rem;
    height: auto;
  }
  .reset-load {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
