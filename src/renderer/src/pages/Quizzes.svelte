<script lang="ts">
  import {
    Tooltip,
    Modal,
    Label,
    Input,
    Dropdown,
    DropdownItem,
    DropdownDivider,
  } from "flowbite-svelte";
  import { Icon } from "svelte-icons-pack";
  import {
    FaSolidBold,
    FaSolidItalic,
    FaSolidUnderline,
    FaSolidLink,
  } from "svelte-icons-pack/fa";

  let formModal = false;
</script>

<div class="container">
  <div class="create-quiz">
    <h1>Create an Assessment</h1>
    <div class="header">
      <input type="text" placeholder="Title" />
      <input type="text" name="description" placeholder="Description" />
      <div class="text-controls">
        <button>
          <Icon src={FaSolidBold} />
          <Tooltip placement="bottom">Make text bold</Tooltip>
        </button>
        <button>
          <Icon src={FaSolidItalic} />
          <Tooltip placement="bottom">Make text italic</Tooltip>
        </button>
        <button>
          <Icon src={FaSolidUnderline} />
          <Tooltip placement="bottom">Underline text</Tooltip>
        </button>
        <button on:click={() => (formModal = true)}>
          <Icon src={FaSolidLink} />
          <Tooltip placement="bottom">Insert a link</Tooltip>
        </button>
      </div>
    </div>
  </div>

  <div class="question-area">
    <div class="question">
      <input
        type="text"
        aria-multiline="true"
        contenteditable="true"
        placeholder="Question"
      />
      <button class="select-type">Select</button>
      <Dropdown>
        <DropdownItem>Short Answer</DropdownItem>
        <DropdownItem>Paragraph</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Multiple Choice</DropdownItem>
        <DropdownItem>Checkboxes</DropdownItem>
        <DropdownItem>Dropdown</DropdownItem>
        <DropdownDivider />
        <DropdownItem>File Upload</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Date</DropdownItem>
        <DropdownItem>Time</DropdownItem>
      </Dropdown>
    </div>

    <div class="text-controls">
      <button>
        <Icon src={FaSolidBold} />
        <Tooltip placement="bottom">Make text bold</Tooltip>
      </button>
      <button>
        <Icon src={FaSolidItalic} />
        <Tooltip placement="bottom">Make text italic</Tooltip>
      </button>
      <button>
        <Icon src={FaSolidUnderline} />
        <Tooltip placement="bottom">Underline text</Tooltip>
      </button>
      <button on:click={() => (formModal = true)}>
        <Icon src={FaSolidLink} />
        <Tooltip placement="bottom">Insert a link</Tooltip>
      </button>
    </div>

    <div class="answer-area">
      <!-- Dynamically assign the type of input based on the question type -->
    </div>

    <div class="separator"></div>

    <div class="text-question-controls">
      <div class="required-toggle">
        <input type="checkbox" id="toggle-require" />
        <p>Required</p>
      </div>
      <button>Duplicate</button>
      <button>Add</button>
      <button>Save</button>
    </div>
  </div>
</div>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full ">
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
    padding-inline: clamp(20vw, 10rem, 30vw);
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
  .text-controls {
    color: var(--text);
    display: flex;
    gap: 1.5rem;
    & button {
      padding: 0.5rem;
      border-radius: 0.5rem;
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
  .question-area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(7px);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1.5rem;
    & .question {
      display: flex;
      gap: 4rem;
      & input {
        padding: 0.5rem;
        border: none;
        width: 80%;
        border-radius: 0.3rem;
        border-bottom: 3px solid var(--border);
        background-color: var(--background);
        color: var(--text);
        transition: border-bottom 0.3s;
        &:focus {
          border-bottom: 3px solid var(--accent);
        }
      }
      & .select-type {
        padding: 0.5rem;
        border: none;
        border-radius: 0.3rem;
        background-color: var(--background);
        color: var(--text);
      }
    }
  }
  .separator {
    height: 2px;
    width: 100%;
    background: rgba(255, 255, 255, 0.2);
  }
  .text-question-controls {
    color: var(--text);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    & button {
      transition: border-bottom 0.3 ease-in-out;
      &:hover {
        border-bottom: 1px solid var(--accent);
      }
    }
  }

  .required-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    & input {
      margin-right: 0.5rem;
      border: none;
      &:checked {
        background-color: var(--accent);
      }
    }
  }
</style>
