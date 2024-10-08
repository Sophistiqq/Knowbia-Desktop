<script>
  import { fly } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  let colors = [
    "#FDFD96",
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
    { type: "rectangle", color: colors[8] },
    { type: "rectangle", color: colors[3] },
    { type: "circle", color: colors[4] },
    { type: "smallBox", color: colors[5] },
    { type: "smallBox", color: colors[6] },
    { type: "smallBox", color: colors[7] },
    { type: "circle", color: colors[15] },
    { type: "triangle", color: colors[9] },
    { type: "smallBox", color: colors[18] },
    { type: "square", color: colors[11] },
    { type: "hollowTriangle", color: colors[12] },
    { type: "triangle", color: colors[13] },
    { type: "rectangle", color: colors[14] },
    { type: "star-five", color: colors[2] },
    { type: "smallBox", color: colors[16] },
    { type: "smallBox", color: colors[17] },
    { type: "smallBox", color: colors[8] },
    { type: "rectangle", color: colors[19] },
    { type: "triangle", color: colors[0] },
    { type: "circle", color: colors[1] },
    { type: "square", color: colors[2] },
    { type: "hollowTriangle", color: colors[3] },
    { type: "triangle", color: colors[4] },
    { type: "rectangle", color: colors[5] },
    { type: "circle", color: colors[6] },
    { type: "smallBox", color: colors[7] },
    { type: "star-five", color: colors[7] },
    { type: "smallBox", color: colors[9] },
    { type: "rectangle", color: colors[10] },
    { type: "triangle", color: colors[11] },
    { type: "circle", color: colors[12] },
    { type: "square", color: colors[13] },
    { type: "hollowTriangle", color: colors[14] },
    { type: "triangle", color: colors[15] },
    { type: "rectangle", color: colors[16] },
    { type: "circle", color: colors[17] },
    { type: "smallBox", color: colors[18] },
    { type: "smallBox", color: colors[19] },
    { type: "smallBox", color: colors[0] },
    { type: "rectangle", color: colors[1] },
    { type: "triangle", color: colors[2] },
    { type: "circle", color: colors[3] },
    { type: "square", color: colors[4] },
    { type: "hollowTriangle", color: colors[5] },
    { type: "triangle", color: colors[6] },
    { type: "rectangle", color: colors[7] },
    { type: "circle", color: colors[8] },
    { type: "smallBox", color: colors[9] },
    { type: "smallBox", color: colors[10] },
    { type: "smallBox", color: colors[11] },
    { type: "rectangle", color: colors[12] },
    { type: "triangle", color: colors[13] },
    { type: "circle", color: colors[14] },
    { type: "square", color: colors[3] },
    { type: "grids", color: colors[4] },
    { type: "star-five", color: colors[5] },
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
    {#if shape.type === "hollowTriangle"}
      <div
        class="hollowTriangle animate"
        style="top: {shape.top}; left: {shape.left}; --color: {shape.color}; --duration: {shape.duration}; --distance: {shape.distance}; --direction: {shape.direction};"
      ></div>
    {/if}
    {#if shape.type === "grids"}
      <div
        class="grids"
        style="top: {shape.top}; left: {shape.left}; --color: {shape.color}; --duration: {shape.duration}; --distance: {shape.distance}; --direction: {shape.direction};"
      ></div>
    {/if}
    {#if shape.type === "star-five"}
      <div
        id="star-five"
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
  .hollowTriangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 75px solid transparent;
    position: absolute;
    border-top: 75px solid var(--color);
  }
  .grids {
    width: 200px;
    height: 200px;
    background-color: var(--color);
    position: absolute;
    border: 3px solid var(--border);
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
  #star-five {
    margin: 50px 0;
    position: relative;
    display: block;
    color: red;
    width: 0px;
    height: 0px;
    border-right: 100px solid transparent;
    border-bottom: 70px solid var(--color);
    border-left: 100px solid transparent;
    transform: rotate(35deg);
  }
  #star-five:before {
    border-bottom: 80px solid var(--color);
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    position: absolute;
    height: 0;
    width: 0;
    top: -45px;
    left: -65px;
    display: block;
    content: "";
    transform: rotate(-35deg);
  }
  #star-five:after {
    position: absolute;
    display: block;
    color: red;
    top: 3px;
    left: -105px;
    width: 0px;
    height: 0px;
    border-right: 100px solid transparent;
    border-bottom: 70px solid var(--color);
    border-left: 100px solid transparent;
    transform: rotate(-70deg);
    content: "";
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
