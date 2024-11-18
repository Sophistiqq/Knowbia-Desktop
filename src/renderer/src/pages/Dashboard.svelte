<script lang="ts">
  import { slide } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { onMount } from "svelte";

  let totalAssessments = 0;
  let registeredStudents = 0;
  let takers = 0;
  let totalOfRecords = 0;
  let numberOfDistributedAssessments = 0;
  onMount(() => {
    getDashboardData();
    getTotalSubmittedRecords();
    getHighestRankings();
  });

  function getHighestRankings() {
    fetch("http://localhost:3000/assessments/rankings")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  function getTotalSubmittedRecords() {
    fetch("http://localhost:3000/assessments/finished")
      .then((res) => res.json())
      .then((data) => {
        totalOfRecords = data.reduce(
          (acc: any, assessment: { results: string | any[] }) =>
            acc + assessment.results.length,
          0,
        );
        numberOfDistributedAssessments = data.length;
        console.log(totalOfRecords);
      });
  }

  function getDashboardData() {
    fetch("http://localhost:3000/assessments/dashboard")
      .then((res) => res.json())
      .then((data) => {
        // Process the data
        totalAssessments = data.assessments.length;
        registeredStudents = data.students.length; // Assuming "connected" means total students
        takers = data.results.length; // Assuming "takers" means results recorded
        totalOfRecords = takers; // Assuming all takers finished
      });
  }
</script>

<h1 id="page-title">Dashboard</h1>

<div class="statistics" transition:slide={{ easing: cubicInOut, delay: 0 }}>
  <h4>Statistics</h4>
  <div class="overview-wrapper">
    <div class="total-assessments">
      <h5>Saved Assessments</h5>
      <p>{totalAssessments}</p>
    </div>
    <div class="distributed-assessments">
      <h5>Distributed Assessments</h5>
      <p>{numberOfDistributedAssessments}</p>
    </div>
    <div class="finished-assessments">
      <h5>Finished Assessments</h5>
      <p>60</p>
      <!-- Replace with dynamic value if available -->
    </div>
  </div>
</div>

<div
  class="student-activity-overview"
  transition:slide={{ easing: cubicInOut, delay: 300 }}
>
  <h4>Student Activity Overview</h4>
  <div class="overview-wrapper">
    <div class="connected-students">
      <h5>Registered</h5>
      <p>{registeredStudents}</p>
    </div>
    <div class="finished-students">
      <h5>Total of Submitted Records</h5>
      <p>{totalOfRecords}</p>
    </div>
  </div>
</div>

<style>
  #page-title {
    margin-bottom: 1rem;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: bold;
    background: var(--background);
    width: fit-content;
    padding: 1rem;
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
    border-radius: 0.5rem;
  }
  .statistics,
  .student-activity-overview {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    margin-top: 2rem;
    gap: 1rem;
    color: var(--text);
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
      backdrop-filter: blur(10px);
      color: var(--text);
      border: 1px solid var(--border);
      & > p {
        font-size: 1.5rem;
        font-weight: 700;
        border-radius: 0.5rem;
        padding: 0.5rem;
      }
    }
  }
</style>
