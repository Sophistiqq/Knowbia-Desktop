<script lang="ts">
  export let selectedStudent: {
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
    year_level: string;
    section: string;
    sex: string;
    birthday: string;
    verified: boolean;
  };

  // Dummy data for assessments and documents
  let assessments = [
    { title: "Math Quiz 1", score: 85, date: "2023-09-15" },
    { title: "Science Midterm", score: 90, date: "2023-09-22" },
  ];

  let downloadableDocs = [
    { name: "Grade Report", link: "/path/to/gradereport.pdf" },
    { name: "Certificate", link: "/path/to/certificate.pdf" },
  ];
</script>

<div class="p-6 z-150">
  <h3 class="text-lg font-medium text-gray-900 mb-4">
    {selectedStudent.firstname}
    {selectedStudent.lastname}'s Details
  </h3>

  <!-- Assessment History -->
  <h4 class="font-semibold text-gray-800">Assessment History</h4>
  <ul class="list-disc pl-5 mb-4">
    {#each assessments as assessment}
      <li>
        {assessment.title} - {assessment.score}% on {new Date(
          assessment.date,
        ).toLocaleDateString()}
      </li>
    {/each}
  </ul>

  <!-- Downloadable Documents -->
  <h4 class="font-semibold text-gray-800">Downloadable Documents</h4>
  <ul class="list-disc pl-5">
    {#each downloadableDocs as doc}
      <li>
        <a
          href={doc.link}
          target="_blank"
          class="text-blue-500 hover:underline"
        >
          {doc.name}
        </a>
      </li>
    {/each}
  </ul>
</div>
