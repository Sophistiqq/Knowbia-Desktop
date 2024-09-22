<script lang="ts">
  import { onMount } from "svelte";
  import { Chart as ChartJS, ChartConfiguration } from "chart.js";

  export let type: string = "bar"; // Chart type
  export let data: object; // Data for the chart
  export let options: object = {}; // Optional configuration

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (canvas && data) {
      try {
        new ChartJS(canvas, {
          type,
          data,
          options,
        } as ChartConfiguration);
      } catch (error) {
        console.error("Chart.js initialization error:", error);
      }
    } else {
      console.warn("Canvas or data is missing for the chart.");
    }
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    max-width: 100%;
    height: auto;
  }
</style>
