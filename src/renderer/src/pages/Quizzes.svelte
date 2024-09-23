<script lang="ts">
  import { onMount } from "svelte";
  import { dndzone } from "svelte-dnd-action";
  import { Tooltip, Modal, Label, Input } from "flowbite-svelte";
  import { FileCopySolid, TrashBinSolid } from "flowbite-svelte-icons";
  import TextControls from "../components/Text-Controls.svelte";
  import DynamicAnswerField from "../components/DynamicAnswerField.svelte";

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

  onMount(() => {
    loadFromLocalStorage();
  });

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

  // Function to duplicate a question
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

  // Function to remove a question
  function removeQuestion(index: number) {
    questions = questions.filter((_, i) => i !== index);
    saveToLocalStorage();
  }

  // Handle drag and drop event
  function handleDnd(event: CustomEvent<{ items: Question[] }>) {
    questions = event.detail.items;
    saveToLocalStorage();
  }

  // Save questions to local storage
  function saveToLocalStorage() {
    localStorage.setItem("quiz-questions", JSON.stringify(questions));
  }

  // Load questions from local storage
  function loadFromLocalStorage() {
    const savedQuestions = localStorage.getItem("quiz-questions");
    if (savedQuestions) {
      questions = JSON.parse(savedQuestions);
    }
  }
</script>

<!-- Rest of your component -->

<div class="container">
  <div class="create-quiz">
    <h1>Create an Assessment</h1>
    <div class="header">
      <input type="text" placeholder="Title" />
      <input type="text" name="description" placeholder="Description" />
      <TextControls {formModal} />
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
          <input
            type="text"
            aria-multiline="true"
            contenteditable="true"
            bind:value={question.content}
            placeholder="Question"
            on:input={saveToLocalStorage}
          />
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
      <Input type="url" name="url" placeholder="Enter the URL" />
    </Label>
    <div class="flex justify-end space-x-2 gap-10">
      <button on:click={() => (formModal = false)}>Cancel</button>
      <button type="submit">Insert Link</button>
    </div>
  </div>
</Modal>

<style>
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
    backdrop-filter: blur(7px);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    gap: 1rem;
    & h1 {
      font-size: 2rem;
    }
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    & input {
      padding: 0.5rem;
      border: none;
      border-radius: 0.3rem;
      border-bottom: 3px solid var(--border);
      background-color: var(--background);
      color: var(--text);
      transition: border-bottom 0.3s;
      &:focus {
        border-bottom: 3px solid var(--accent);
      }
    }
  }

  .question-container {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(7px);
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
    & input {
      padding: 0.5rem;
      border: none;
      width: 100%;
      border-radius: 0.3rem;
      border-bottom: 3px solid var(--border);
      background-color: var(--background);
      color: var(--text);
      transition: border-bottom 0.3s;
      &:focus {
        border-bottom: 3px solid var(--accent);
      }
    }
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
      width: 1.5rem;
      height: 1.5rem;
      &:checked {
        background-color: var(--accent);
      }
    }
  }

  .add-question {
    padding: 0.5rem 1rem;
    background-color: var(--primary);
    color: var(--text);
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
      background-color: var(--secondary);
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
</style>
