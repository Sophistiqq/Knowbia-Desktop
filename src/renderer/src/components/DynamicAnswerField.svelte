<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
  interface Question {
    id: number;
    type: string;
    content: string;
    required: boolean;
    options?: string[];
    correctAnswer?: number;
    correctAnswers?: number[]; // For checkboxes
    answer?: string;
  }

  export let question: Question;

  function addOption() {
    question.options = question.options || [];
    question.options = [
      ...question.options,
      `Option ${question.options.length + 1}`,
    ];
  }

  function removeOption(optionIndex: number) {
    question.options = question.options.filter((_, i) => i !== optionIndex);
  }

  function updateOption(optionIndex: number, value: string) {
    question.options[optionIndex] = value;
  }

  function handleInput(event: Event, optIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input) {
      updateOption(optIndex, input.value);
    }
  }

  function toggleCorrectAnswer(optIndex: number) {
    if (!question.correctAnswers) {
      question.correctAnswers = [];
    }
    const index = question.correctAnswers.indexOf(optIndex);
    if (index > -1) {
      question.correctAnswers.splice(index, 1);
    } else {
      question.correctAnswers.push(optIndex);
    }
  }
</script>

<div class="answer-field">
  {#if question.type === "Short Answer"}
    <input type="text" class="short-answer" placeholder="Your answer" />
    <Tooltip>Enter a short answer</Tooltip>
  {/if}

  {#if question.type === "Paragraph"}
    <textarea class="paragraph" placeholder="Your answer"></textarea>
  {/if}

  {#if question.type === "Multiple Choice"}
    <div class="multiple-choice-options">
      {#each question.options as _option, optIndex}
        <div class="option-item">
          <input
            type="radio"
            id="option-{optIndex}"
            name="option-{question.id}"
            on:change={() => (question.correctAnswer = optIndex)}
          />

          <Tooltip>Select as Answer</Tooltip>
          <input
            type="text"
            bind:value={question.options[optIndex]}
            placeholder="Option {optIndex + 1}"
            on:input={(e) => handleInput(e, optIndex)}
          />
          <button on:click={() => removeOption(optIndex)}>Remove</button>
        </div>
      {/each}
      <button on:click={addOption}>Add Option</button>
    </div>
  {/if}

  {#if question.type === "Checkboxes"}
    <div class="checkbox-options">
      {#each question.options as _option, optIndex}
        <div class="option-item">
          <input
            type="checkbox"
            id="checkbox-{optIndex}"
            name="checkbox-{question.id}"
            on:change={() => toggleCorrectAnswer(optIndex)}
          />

          <Tooltip>Select as Answer</Tooltip>
          <input
            type="text"
            bind:value={question.options[optIndex]}
            placeholder="Option {optIndex + 1}"
            on:input={(e) => handleInput(e, optIndex)}
          />
          <button on:click={() => removeOption(optIndex)}>Remove</button>
        </div>
      {/each}
      <button on:click={addOption}>Add Option</button>
    </div>
  {/if}

  {#if question.type === "Dropdown"}
    <div class="dropdown-options">
      {#each question.options as _option, optIndex}
        <div class="option-item">
          <input
            type="radio"
            id="dropdown-option-{optIndex}"
            name="dropdown-option-{question.id}"
            on:change={() => (question.correctAnswer = optIndex)}
          />

          <Tooltip>Select as Answer</Tooltip>
          <input
            type="text"
            bind:value={question.options[optIndex]}
            placeholder="Option {optIndex + 1}"
            on:input={(e) => handleInput(e, optIndex)}
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
    />
  {/if}

  {#if question.type === "Time"}
    <input
      type="time"
      bind:value={question.answer}
      placeholder="Select a time"
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
    background-color: var(--background);
    border-radius: 0.3rem;
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
    &:checked {
      background-color: var(--secondary);
    }
  }

  .option-item input[type="text"] {
    flex-grow: 1;
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
