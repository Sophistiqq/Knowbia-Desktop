<script lang="ts">
  import { slide } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { Bar, Line } from "svelte-chartjs";
  import type { ChartData, ChartOptions } from "chart.js";
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);

  // ... (previous dashboard variables)
  let totalAssessments = 0;
  let registeredStudents = 0;
  let takers = 0;
  let totalOfRecords = 0;
  let numberOfDistributedAssessments = 0;

  // New variables for student scores
  let studentScores: ChartData = {
    labels: [],
    datasets: [],
  };

  let studentLineOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Student Scores by Assessment",
        color: "white",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  // Original chart data and options
  let chartData: ChartData = {
    labels: ["Assessments", "Registered", "Takers", "Records"],
    datasets: [
      {
        label: "Assessments Overview",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
        data: [0, 0, 0, 0],
      },
    ],
  };

  let chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  onMount(async () => {
    await Promise.all([
      getDashboardData(),
      getTotalSubmittedRecords(),
      getHighestRankings(),
      getStudentScores(),
    ]);

    // Update chart data after fetching
    chartData = {
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: [totalAssessments, registeredStudents, takers, totalOfRecords],
        },
      ],
    };
  });

  async function getStudentScores() {
    try {
      const response = await fetch(
        "http://localhost:3000/assessments/assessment_results",
      );
      const data = await response.json();

      // Process the data for the chart
      const students = [
        ...new Set(data.map((record) => record.student_number)),
      ];
      const assessments = [
        ...new Set(data.map((record) => record.assessment_id)),
      ];

      // Sort assessments and create labels
      const sortedAssessments = assessments.sort((a, b) => a - b);
      const labels = sortedAssessments.map((id) => `Assessment ${id}`);

      // Create datasets for each student
      const datasets = students.map((student, index) => {
        const studentData = sortedAssessments.map((assessmentId) => {
          const record = data.find(
            (r) =>
              r.student_number === student && r.assessment_id === assessmentId,
          );
          return record ? record.score : null;
        });

        // Generate a unique color for each student
        const hue = (index * 137.508) % 360; // Golden angle approximation
        const color = `hsl(${hue}, 70%, 60%)`;

        return {
          label: `Student ${student}`,
          data: studentData,
          borderColor: color,
          backgroundColor: `${color}33`,
          fill: false,
          tension: 0.1,
        };
      });

      studentScores = {
        labels,
        datasets,
      };
    } catch (error) {
      console.error("Error fetching student scores:", error);
    }
  }

  // ... (previous fetch functions)
  async function getHighestRankings() {
    const res = await fetch("http://localhost:3000/assessments/rankings");
    const data = await res.json();
    console.log(data);
  }

  async function getTotalSubmittedRecords() {
    const res = await fetch("http://localhost:3000/assessments/finished");
    const data = await res.json();
    totalOfRecords = data.reduce(
      (acc: number, assessment: { results: any[] }) =>
        acc + assessment.results.length,
      0,
    );
    numberOfDistributedAssessments = data.length;
  }

  async function getDashboardData() {
    const res = await fetch("http://localhost:3000/assessments/dashboard");
    const data = await res.json();
    totalAssessments = data.assessments.length;
    registeredStudents = data.students.length;
    takers = data.results.length;
    totalOfRecords = takers;
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
    <div class="finished-assessments">
      <h5>Finished Assessments</h5>
      <p>{numberOfDistributedAssessments}</p>
    </div>
    <div class="finished-students">
      <h5>Total of Submitted Records</h5>
      <p>{totalOfRecords}</p>
    </div>
    <div class="connected-students">
      <h5>Registered</h5>
      <p>{registeredStudents}</p>
    </div>
  </div>
</div>

<div
  class="charts-container"
  transition:slide={{ easing: cubicInOut, delay: 0 }}
>
  <div class="chart-section">
    <h4>Assessments Overview</h4>
    <div class="chart-wrapper">
      <Bar data={chartData} options={chartOptions} />
    </div>
  </div>

  <div class="chart-section">
    <h4>Student Performance</h4>
    <div class="chart-wrapper">
      <Line data={studentScores} options={studentLineOptions} />
    </div>
  </div>
</div>

<style>
  /* Previous styles remain the same */
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
  .statistics {
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

  .charts-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    margin-top: 2rem;
  }

  .chart-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text);
    & h4 {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  .chart-wrapper {
    width: 100%;
    height: 400px;
    background-color: var(--background);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    .charts-container {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
