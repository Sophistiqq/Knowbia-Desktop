<script lang='ts'>
  import { slide } from 'svelte/transition';
  import {cubicInOut} from 'svelte/easing';

  let savedAssessments = 145;
</script>

<h1 id="page-title">Dashboard</h1>

<div class="statistics" transition:slide={{easing: cubicInOut, delay: 0}}>
  <h4>Statistics</h4>
  <div class="overview-wrapper">
    <div class="total-assessments">
      <h5>Saved Assessments</h5>
      <p>{savedAssessments}</p>
    </div>
    <div class="distributed-assessments">
      <h5>Distributed Assessments</h5>
      <p>60</p>
    </div>
    <div class="finished-assessments">
      <h5>Finished Assessments</h5>
      <p>60</p>
    </div>
  </div>
</div>

<div class="student-activity-overview" transition:slide={{easing: cubicInOut, delay: 300}}>
  <h4>Student Activity Overview</h4>
  <div class="overview-wrapper">
    <div class="connected-students">
      <h5>Connected</h5>
      <p>60</p>
    </div>
    <div class="assessment-takers">
      <h5>Takers</h5>
      <p>60</p>
    </div>
    <div class="finished-students">
      <h5>Finished</h5>
      <p>60</p>
    </div>
  </div>
</div>

<style>
  #page-title {
    margin-bottom: 1rem;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: bold;
    background: var(--primary);
    width: fit-content;
    padding: 1rem;
    border: 2px solid var(--text);
    border-radius: 0.5rem;
    box-shadow: 6px 8px 0px 0px var(--border);
  }
  .statistics,
  .student-activity-overview {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    margin-top: 2rem;
    gap: 1rem;
    & h4 {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
  .overview-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    & > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background-color: var(--background);
      border: 2px solid var(--text);
      box-shadow: 4px 4px 0px var(--border);
      & > p {
        font-size: 1.5rem;
        font-weight: 700;
        background: var(--accent);
        border-radius: 0.5rem;
        padding: 0.5rem;
      }
    }
  }


</style>
