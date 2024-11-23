<script lang="ts">
  import { onMount } from "svelte";

  // Types for better type safety
  type Assessment = {
    assessment_id: any;
    title: string;
  };

  type RestrictedUser = {
    studentNumber: string;
    reason?: string;
    restrictedAt?: Date;
  };

  let assessments: Assessment[] = [];
  let restrictedUsers: RestrictedUser[] = [];
  let finishedAssessments: Assessment[] = [];
  let showModal = false;
  let modalType:
    | "restrictedUsers"
    | "cancelAssessment"
    | "deleteFinishedAssessment"
    | null = null;
  let selectedAssessment: Assessment | null = null;
  let selectedUser: RestrictedUser | null = null;

  // Fetch assessments and restricted users on mount
  onMount(async () => {
    await Promise.all([
      fetchAssessments(),
      fetchRestrictedUsers(),
      fetchFinishedAssessments(),
    ]);
  });

  // Fetch active assessments
  async function fetchAssessments() {
    try {
      const res = await fetch("http://localhost:3000/distribution/assessments");
      const data = await res.json();
      assessments = data.assessments;
      console.log(assessments);
    } catch (error) {
      console.error("Failed to fetch assessments", error);
    }
  }

  // Fetch restricted users
  async function fetchRestrictedUsers() {
    try {
      const res = await fetch(
        "http://localhost:3000/assessments/restrictedUsers",
      );
      restrictedUsers = await res.json();
    } catch (error) {
      console.error("Failed to fetch restricted users", error);
    }
  }

  // Fetch finished assessments
  async function fetchFinishedAssessments() {
    try {
      const res = await fetch("http://localhost:3000/assessments/finished");
      const data = await res.json();
      finishedAssessments = data;
      console.log(finishedAssessments);
    } catch (error) {
      console.error("Failed to fetch finished assessments", error);
    }
  }

  // Delete a finished assessment
  async function deleteFinishedAssessment() {
    if (!selectedAssessment) return;
    console.log("Deleting assessment", selectedAssessment);
    try {
      const res = await fetch(
        "http://localhost:3000/assessments/deleteFinished",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentId: selectedAssessment.assessment_id,
          }),
        },
      );

      const data = await res.json();
      console.log(data);
      if (data.success) {
        // Remove the deleted assessment from the list
        finishedAssessments = finishedAssessments.filter(
          (a) => a.assessment_id !== selectedAssessment?.assessment_id,
        );
        closeModal();
      }
    } catch (error) {
      console.error("Failed to delete finished assessment", error);
    }
  }

  function openModal(
    type: "restrictedUsers" | "cancelAssessment" | "deleteFinishedAssessment",
    data?: Assessment | RestrictedUser,
  ) {
    modalType = type;
    showModal = true;

    if (type === "cancelAssessment") {
      selectedAssessment = data as Assessment;
    } else if (type === "restrictedUsers") {
      selectedUser = data as RestrictedUser;
    } else if (type === "deleteFinishedAssessment") {
      selectedAssessment = data as Assessment;
    }
  }

  // Close modal
  function closeModal() {
    showModal = false;
    modalType = null;
    selectedAssessment = null;
    selectedUser = null;
  }

  // Cancel an assessment
  async function cancelAssessment() {
    if (!selectedAssessment) return;

    try {
      const res = await fetch("http://localhost:3000/distribution/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assessmentId: selectedAssessment.assessment_id }),
      });

      const data = await res.json();
      if (data.success) {
        // Remove the cancelled assessment from the list
        assessments = assessments.filter(
          (a) => a.assessment_id !== selectedAssessment?.assessment_id,
        );
        closeModal();
      }
    } catch (error) {
      console.error("Failed to cancel assessment", error);
    }
  }

  // Remove user restriction
  async function unrestrictUser() {
    if (!selectedUser) return;

    try {
      const res = await fetch("http://localhost:3000/assessments/unrestrict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentNumber: selectedUser.studentNumber }),
      });

      const data = await res.json();
      if (data.success) {
        // Remove the unrestricted user from the list
        restrictedUsers = restrictedUsers.filter(
          (u) => u.studentNumber !== selectedUser?.studentNumber,
        );
        closeModal();
      }
    } catch (error) {
      console.error("Failed to unrestrict user", error);
    }
  }
</script>

<h1>Assessment Management</h1>
<div class="container">
  <!-- Assessments Section -->
  <section class="assessments-section">
    <h2>Active Assessments</h2>
    {#if assessments.length > 0}
      {#each assessments as assessment}
        <div class="assessment-item">
          <span>{assessment.title}</span>
          <button
            class="cancel-btn"
            on:click={() => openModal("cancelAssessment", assessment)}
          >
            Cancel Assessment
          </button>
        </div>
      {/each}
    {:else}
      <p>No active assessments</p>
    {/if}
  </section>

  <!-- Restricted Users Section -->
  <section class="restricted-users-section">
    <h2>Restricted Users</h2>
    {#if restrictedUsers.length > 0}
      {#each restrictedUsers as user}
        <div class="restricted-user-item">
          <span>Student Number: {user.studentNumber}</span>
          <button
            class="unrestrict-btn"
            on:click={() => openModal("restrictedUsers", user)}
          >
            Remove Restriction
          </button>
        </div>
      {/each}
    {:else}
      <p>No restricted users</p>
    {/if}
  </section>

  <!-- Finished Assessments Section -->
  <section class="finished-assessments-section">
    <h2>Finished Assessments</h2>
    {#if finishedAssessments.length > 0}
      {#each finishedAssessments as assessment}
        <div class="assessment-item">
          <span>{assessment.title}</span>
          <button
            class="delete-btn"
            on:click={() => openModal("deleteFinishedAssessment", assessment)}
          >
            Delete Assessment
          </button>
        </div>
      {/each}
    {:else}
      <p>No finished assessments</p>
    {/if}
  </section>

  {#if showModal}
    <button class="modal-backdrop" on:click={closeModal}>
      <button class="modal" on:click|stopPropagation>
        {#if modalType === "cancelAssessment"}
          <h3 class="text-[--secondary]">Cancel Assessment</h3>
          <p>
            Are you sure you want to cancel the assessment<br
            />"{selectedAssessment?.title}"?
          </p>
          <div class="modal-actions">
            <button class="confirm-btn" on:click={cancelAssessment}
              >Confirm</button
            >
            <button class="cancel-btn" on:click={closeModal}>Cancel</button>
          </div>
        {:else if modalType === "restrictedUsers"}
          <h3>Remove User Restriction</h3>
          <p>
            Are you sure you want to remove restriction for student {selectedUser?.studentNumber}?
          </p>
          <div class="modal-actions">
            <button class="confirm-btn" on:click={unrestrictUser}
              >Confirm</button
            >
            <button class="cancel-btn" on:click={closeModal}>Cancel</button>
          </div>
        {:else if modalType === "deleteFinishedAssessment"}
          <h3>Delete Finished Assessment</h3>
          <p>
            Are you sure you want to delete the finished assessment<br
            />"{selectedAssessment?.title}"?
          </p>
          <div class="modal-actions">
            <button class="confirm-btn" on:click={deleteFinishedAssessment}
              >Confirm</button
            >
            <button class="cancel-btn" on:click={closeModal}>Cancel</button>
          </div>
        {/if}
      </button>
    </button>
  {/if}
</div>

<style lang="scss">
  .container {
    max-width: 800px;
    margin: 0 auto;
    color: var(--text);
    border-radius: 0.5rem;
  }
  h1 {
    margin-bottom: 1rem;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: bold;
    background: var(--background);
    width: fit-content;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
  }
  h2 {
    margin-bottom: 1rem;
    color: var(--text);
  }

  .assessments-section,
  .restricted-users-section,
  .finished-assessments-section {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    background: var(--background);
  }

  .assessment-item,
  .restricted-user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid var(--border);

    &:last-child {
      border-bottom: none;
    }
  }

  .cancel-btn,
  .unrestrict-btn,
  .delete-btn {
    background-color: var(--button-background);
    color: var(--button-text);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--button-hover-background);
    }
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: default;
  }

  .modal {
    background: var(--background);
    padding: 2rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    max-width: 500px;
    width: 100%;
    text-align: center;
    backdrop-filter: blur(10px);
    cursor: default;
    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .confirm-btn {
      background-color: var(--background);
      color: var(--text);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border);
      transition: background-color 0.3s;
      &:hover {
        background-color: var(--hover);
      }
    }

    .cancel-btn {
      background-color: var(--background);
      color: white;
      padding: 0.5rem 1rem;
      transition: background-color 0.3s;
      &:hover {
        background-color: var(--hover);
      }
    }
  }
</style>
