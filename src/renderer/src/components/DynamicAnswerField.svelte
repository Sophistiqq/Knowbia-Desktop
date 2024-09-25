<script lang="ts">
  import { Tooltip } from "flowbite-svelte";

  interface Question {
    id: number;
    type: string;
    content: string;
    required: boolean;
    options?: string[];
    correctAnswer?: number; // For single-choice questions
    correctAnswers?: number[]; // For multiple-choice questions
    answer?: string; // For textual answers
  }

  export let question: Question = {
    id: 0,
    type: "",
    content: "",
    required: false,
    options: [],
    correctAnswer: undefined,
    correctAnswers: [],
    answer: "",
  };

  // Trigger saveToLocalStorage after input changes
  export let onSave = () => {};

  function resetCorrectAnswers() {
    question.correctAnswer = undefined;
    question.correctAnswers = [];
  }

  function addOption() {
    question.options = question.options || [];
    question.options.push(`Option ${question.options.length + 1}`);
    resetCorrectAnswers(); // Reset answers when adding options
    onSave(); // Save changes
  }

  function removeOption(optionIndex: number) {
    question.options = question.options.filter((_, i) => i !== optionIndex);
    resetCorrectAnswers(); // Reset answers when removing options
    onSave(); // Save changes
  }

  function updateOption(optionIndex: number, value: string) {
    question.options[optionIndex] = value;
    onSave(); // Save changes
  }

  function handleInput(event: Event, optIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input) {
      if (optIndex >= 0) {
        updateOption(optIndex, input.value);
      } else {
        question.content = input.value;
      }
    }
    onSave(); // Save changes on input
  }

  function toggleCorrectAnswer(optIndex: number) {
    if (!question.correctAnswers) {
      question.correctAnswers = [];
    }
    const index = question.correctAnswers.indexOf(optIndex);
    if (index > -1) {
      question.correctAnswers.splice(index, 1); // Deselect answer
    } else {
      question.correctAnswers.push(optIndex); // Select answer
    }
    onSave(); // Save changes when toggling answers
  }

  function handleAnswerInput(event: Event) {
    const input = event.target as HTMLInputElement;
    question.answer = input.value; // Bind answer to the question
    onSave(); // Trigger saving when an answer changes
  }

  let textareaRef: HTMLTextAreaElement;

  function autoResize() {
    if (textareaRef) {
      textareaRef.style.height = "auto";
      textareaRef.style.height = `${textareaRef.scrollHeight}px`;
    }
  }
</script>

<div class="answer-field">
  {#if question.type === "Short Answer"}
    <input
      type="text"
      class="short-answer"
      placeholder="Your answer"
      bind:value={question.answer}
      on:input={handleAnswerInput}
    />
    <Tooltip>Enter a short answer</Tooltip>
  {/if}

  {#if question.type === "Paragraph"}
    <textarea
      class="paragraph"
      bind:this={textareaRef}
      bind:value={question.answer}
      placeholder="Your answer"
      rows="1"
      on:input={(e) => {
        handleInput(e, -1);
        autoResize();
      }}
      style="overflow: hidden; resize: none;"
    ></textarea>
  {/if}

  {#if question.type === "Multiple Choice"}
    <div class="multiple-choice-options">
      {#each question.options as option, optIndex}
        <div class="option-item">
          <input
            type="radio"
            id="option-{optIndex}"
            name="option-{question.id}"
            bind:group={question.correctAnswer}
            value={optIndex}
            on:change={() => {
              question.correctAnswer = optIndex;
              onSave(); // Save when selecting an answer
            }}
          />
          <Tooltip>Select as Answer</Tooltip>
          <input
            type="text"
            bind:value={question.options[optIndex]}
            placeholder="Option {optIndex + 1}"
            on:input={(e) => handleInput(e, optIndex)}
            style="overflow: hidden; resize: none;"
          />
          <button on:click={() => removeOption(optIndex)}>Remove</button>
        </div>
      {/each}
      <button on:click={addOption}>Add Option</button>
    </div>
  {/if}

  {#if question.type === "Checkboxes"}
    <div class="checkbox-options">
      {#each question.options as option, optIndex}
        <div class="option-item">
          <input
            type="checkbox"
            id="checkbox-{optIndex}"
            name="checkbox-{question.id}"
            checked={question.correctAnswers &&
              question.correctAnswers.includes(optIndex)}
            on:change={() => toggleCorrectAnswer(optIndex)}
          />
          <Tooltip>Select as Answer</Tooltip>
          <input
            type="text"
            bind:value={question.options[optIndex]}
            placeholder="Option {optIndex + 1}"
            on:input={(e) => handleInput(e, optIndex)}
            style="overflow: hidden; resize: none;"
          />
          <button on:click={() => removeOption(optIndex)}>Remove</button>
        </div>
      {/each}
      <button on:click={addOption}>Add Option</button>
    </div>
  {/if}

  {#if question.type === "Dropdown"}
    <div class="dropdown-options">
      {#each question.options as option, optIndex}
        <div class="option-item">
          <input
            type="radio"
            id="option-{optIndex}"
            name="option-{question.id}"
            bind:group={question.correctAnswer}
            value={optIndex}
            on:change={onSave}
          />
          <Tooltip>Select as Answer</Tooltip>
          <input
            type="text"
            bind:value={question.options[optIndex]}
            placeholder="Option {optIndex + 1}"
            on:input={(e) => handleInput(e, optIndex)}
            style="overflow: hidden; resize: none;"
          />
          <button on:click={() => removeOption(optIndex)}>Remove</button>
        </div>
      {/each}
      <button on:click={addOption}>Add Option</button>
    </div>
  {/if}

  {#if question.type === "Date"}
    <input
      type="date"
      bind:value={question.answer}
      placeholder="Select a date"
      on:change={handleAnswerInput}
    />
  {/if}

  {#if question.type === "Time"}
    <input
      type="time"
      bind:value={question.answer}
      placeholder="Select a time"
      on:change={handleAnswerInput}
    />
  {/if}

  <div class="separator"></div>
</div>

<style>
  .answer-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .short-answer,
  .paragraph {
    padding: 0.5rem;
    color: var(--text);
    background-color: var(--background);
    border-radius: 0.3rem;
    resize: none;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .option-item input[type="radio"],
  .option-item input[type="checkbox"] {
    width: 1rem;
    background-color: var(--background);
  }

  .option-item input[type="text"] {
    flex-grow: 1;
    background-color: var(--background);
    color: var(--text);
    border: none;
    padding: 0.5rem;
    border-radius: 0.3rem;
    overflow: hidden;
    resize: none;
  }

  .option-item button {
    background-color: red;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 0.3rem;
    cursor: pointer;
  }

  .option-item button:hover {
    background-color: darkred;
  }

  button {
    padding: 0.4rem 0.8rem;
    border: none;
    background-color: var(--primary);
    color: white;
    cursor: pointer;
    border-radius: 0.3rem;
  }

  button:hover {
    background-color: var(--secondary);
  }

  .separator {
    border-top: 2px solid var(--text);
    margin-block: 1rem;
  }
</style>
