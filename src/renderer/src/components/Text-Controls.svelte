<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
  import { Icon } from "svelte-icons-pack";
  import {
    FaSolidBold,
    FaSolidItalic,
    FaSolidUnderline,
    FaSolidLink,
    FaSolidRepeat,
  } from "svelte-icons-pack/fa";

  export let formModal = false;
  export let resetStorage: () => void;
  export let insertLink: () => void;
  export let contentEditableElement: HTMLElement;

  // Apply bold, italic, or underline formatting
  function wrapSelectedText(tag: string) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText.length > 0) {
        const span = document.createElement(tag);
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
        contentEditableElement.focus();
      }
    }
  }

  // Link insertion function
  function insertLinkInText() {
    const url = prompt("Enter the URL", "http://");
    const linkText = prompt("Enter the link text", "Link");
    if (url && linkText) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const link = document.createElement("a");
        link.href = url;
        link.textContent = linkText;
        link.target = "_blank";
        range.deleteContents();
        range.insertNode(link);
        contentEditableElement.focus();
      }
    }
  }
</script>

<div class="text-controls">
  <button on:click={() => wrapSelectedText("b")}>
    <Icon src={FaSolidBold} />
    <Tooltip placement="bottom">Make text bold</Tooltip>
  </button>
  <button on:click={() => wrapSelectedText("i")}>
    <Icon src={FaSolidItalic} />
    <Tooltip placement="bottom">Make text italic</Tooltip>
  </button>
  <button on:click={() => wrapSelectedText("u")}>
    <Icon src={FaSolidUnderline} />
    <Tooltip placement="bottom">Underline text</Tooltip>
  </button>
  <button on:click={insertLinkInText}>
    <Icon src={FaSolidLink} />
    <Tooltip placement="bottom">Insert a link</Tooltip>
  </button>
  <button id="reset" on:click={resetStorage}>
    <Icon src={FaSolidRepeat} />
    <Tooltip placement="bottom">Reset</Tooltip>
  </button>
</div>
