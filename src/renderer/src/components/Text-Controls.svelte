<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
  import { Icon } from "svelte-icons-pack";
  import {
    FaSolidBold,
    FaSolidItalic,
    FaSolidUnderline,
    FaSolidLink,
  } from "svelte-icons-pack/fa";

  export let formModal = false;
</script>

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

<style>
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
</style>
