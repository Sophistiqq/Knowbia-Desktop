<script>
  import { fly } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  let colors = [
    "#DAF5F0",
    "#B5D2AD",
    "#FDFD96",
    "#F8D6B3",
    "#FCDFDF",
    "#E3DFF2",
    "#A7DBD8",
    "#BAFCA2",
    "#FFDB58",
    "#FFA07A",
    "#FFC0CB",
    "#C4A1FF",
    "#87CEEB",
    "#90EE90",
    "#F4D738",
    "#FF7A5C",
    "#FFB2EF",
    "#A388EE",
    "#69D2E7",
    "#7FBC8C",
    "#E3A018",
    "#FFB6B",
    "#FF69B4",
    "#9723C9",
  ];

  let shapes = [
    { type: "triangle", color: colors[2] },
    { type: "square", color: colors[1] },
    { type: "circle", color: colors[2] },
    { type: "rectangle", color: colors[3] },
    { type: "circle", color: colors[4] },
    { type: "smallBox", color: colors[5] },
    { type: "smallBox", color: colors[6] },
    { type: "smallBox", color: colors[7] },
    { type: "rectangle", color: colors[8] },
    { type: "triangle", color: colors[9] },
    { type: "circle", color: colors[10] },
    { type: "square", color: colors[11] },
  ];

  function getRandomPosition() {
    const top = Math.random() * 90 + "%"; // Random top percentage (0% to 90%)
    const left = Math.random() * 90 + "%"; // Random left percentage (0% to 90%)
    return { top, left };
  }

  function getRandomAnimation() {
    const duration = Math.random() * 5 + 3 + "s"; // Random duration between 3s and 8s
    const distance = Math.random() * 50 + 10 + "px"; // Random movement distance (10px to 60px)
    const direction = Math.random() < 0.5 ? 1 : -1; // Random direction (up or down)
    return { duration, distance, direction };
  }

  // Assign random positions and animations to each shape
  shapes = shapes.map((shape) => {
    const position = getRandomPosition();
    const animation = getRandomAnimation();
    return { ...shape, ...position, ...animation };
  });
</script>

<div
  class="background"
  transition:fly={{ x: -200, duration: 500, easing: cubicInOut }}
>
  {#each shapes as shape}
    {#if shape.type === "triangle"}
      <div
        class="triangle animate"
        style="top: {shape.top}; left: {shape.left}; --color: {shape.color}; --duration: {shape.duration}; --distance: {shape.distance}; --direction: {shape.direction};"
      ></div>
    {/if}
    {#if shape.type === "square"}
      <div
        class="square animate"
        style="top: {shape.top}; left: {shape.left}; --color: {shape.color}; --duration: {shape.duration}; --distance: {shape.distance}; --direction: {shape.direction};"
      ></div>
    {/if}
    {#if shape.type === "rectangle"}
      <div
        class="rectangle animate"
        style="top: {shape.top}; left: {shape.left}; --color: {shape.color}; --duration: {shape.duration}; --distance: {shape.distance}; --direction: {shape.direction};"
      ></div>
    {/if}
    {#if shape.type === "circle"}
      <div
        class="circle animate"
        style="top: {shape.top}; left: {shape.left}; --color: {shape.color}; --duration: {shape.duration}; --distance: {shape.distance}; --direction: {shape.direction};"
      ></div>
    {/if}
    {#if shape.type === "smallBox"}
      <div
        class="smallBox animate"
        style="top: {shape.top}; left: {shape.left}; --color: {shape.color}; --duration: {shape.duration}; --distance: {shape.distance}; --direction: {shape.direction};"
      ></div>
    {/if}
  {/each}
</div>

<style>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-color: transparent;
  }

  .triangle {
    width: 0;
    height: 0;
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;
    border-bottom: 150px solid var(--color);
    position: absolute;
    border: 3px solid var(--border);
  }

  .square {
    width: 150px;
    height: 150px;
    background-color: var(--color);
    position: absolute;
    border: 3px solid var(--border);
  }

  .rectangle {
    width: 200px;
    height: 100px;
    background-color: var(--color);
    position: absolute;
    border: 3px solid var(--border);
  }

  .circle {
    border: 3px solid var(--border);
    width: 200px;
    height: 200px;
    background-color: var(--color);
    border-radius: 50%;
    position: absolute;
  }

  .smallBox {
    width: 50px;
    height: 50px;
    background-color: var(--color);
    border: 3px solid var(--border);
    position: absolute;
  }

  /* Animations */
  .animate {
    animation: move var(--duration) infinite ease-in-out alternate;
  }

  @keyframes move {
    0% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(calc(var(--direction) * var(--distance)));
    }
  }
</style>
