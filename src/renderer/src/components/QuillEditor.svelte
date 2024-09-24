<script lang="ts">
  import { onMount } from "svelte";
  import Quill from "quill";

  export let content: string = "";

  let quill: Quill;

  onMount(() => {
    quill = new Quill("#editor", {
      theme: "snow", // You can use 'bubble' or any other theme
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          ["link", "image", "clean"], // Add more buttons as needed
        ],
      },
    });

    // Set initial content
    quill.root.innerHTML = content;

    // Update content on change
    quill.on("text-change", () => {
      content = quill.root.innerHTML;
      console.log("Current content:", content); // Optional: log the content
    });
  });
</script>

<div id="editor" style="height: 300px;"></div>

<style>
  #editor {
    border: 1px solid #ccc;
  }
</style>
