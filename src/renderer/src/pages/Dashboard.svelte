<script lang="ts">
  import { Bar, Pie } from "svelte-chartjs";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from "chart.js";

  // Register the necessary components with Chart.js
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  );

  // Hardcoded data
  let totalAssessments= 10;
  let registeredStudents = 50;
  let activeStudents = 35;

  let studentPerformance = [
    { name: "John Doe", score: 85 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "John Doe", score: 85 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "John Doe", score: 85 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "John Doe", score: 85 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
    { name: "Jane Smith", score: 90 },
    { name: "James Brown", score: 75 },
    { name: "Jessica White", score: 80 },
    { name: "Jack Black", score: 70 },
  ];

  // Calculate average score
  const averageScore =
    studentPerformance.reduce((sum, student) => sum + student.score, 0) /
    studentPerformance.length;

  // Data for student performance chart
  const performanceData = {
    labels: studentPerformance.map((student) => student.name),
    datasets: [
      {
        label: "Scores",
        data: studentPerformance.map((student) => student.score),
        backgroundColor: "rgba(59, 67, 216, 0.7)",
        borderColor: "rgba(59, 67, 216, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for active vs registered students chart
  const activityData = {
    labels: ["Active Students", "Inactive Students"],
    datasets: [
      {
        data: [activeStudents, registeredStudents - activeStudents],
        backgroundColor: ["rgba(59, 67, 216, 0.7)", "rgba(227, 151, 45, 0.7)"],
        borderColor: ["rgba(59, 67, 216, 1)", "rgba(227, 151, 45, 1)"],
        borderWidth: 1,
      },
    ],
  };
</script>

<div class="dashboard">
  <h2>Teacher's Dashboard</h2>
  <div class="data-containers">
    <div class="charts">
      <div class="performance-container">
        <h3>Student Performance</h3>
        <Bar
          data={performanceData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
      <div class="activity-container">
        <h3>Active vs. Inactive Students</h3>
        <Pie
          data={activityData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
    <div class="overview">
      <div class="card">
        <h3>Total Assessments</h3>
        <p>{totalAssessments}</p>
      </div>
      <div class="card">
        <h3>Registered Students</h3>
        <p>{registeredStudents}</p>
      </div>
      <div class="card">
        <h3>Active Students</h3>
        <p>{activeStudents}</p>
      </div>
      <div class="card">
        <h3>Average Score</h3>
        <p>{averageScore.toFixed(2)}%</p>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard {
    color: var(--text);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
  }

  .dashboard h2 {
    font-size: 2rem;
  }

  .data-containers {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 2rem;
  }

  .charts {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    flex: 2; /* Flexible width */
  }

  .performance-container,
  .activity-container {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 2rem;
    height: 400px;
    transition: transform 0.3s;
  }

  .performance-container:hover,
  .activity-container:hover {
    transform: scale(1.02);
  }

  .overview {
    display: flex;
    gap: 2rem;
    flex-direction: column;
    flex: 1; /* Flexible width */
  }

  .card {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--border);
    padding: 1.5rem;
    border-radius: 0.75rem;
    text-align: center;
    transition: transform 0.3s;
    font-size: 1rem;
  }

  .card:hover {
    transform: scale(1.05);
  }
</style>
