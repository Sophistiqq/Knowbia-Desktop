<script lang="ts">
  import ProfileModal from "./ProfileModal.svelte";
  export let logout: () => void;

  // Retrieve user info from localStorage
  let user = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    email: "",
  };
  let show = "";
  function openDropdown() {
    show = show === "" ? "show" : "";
  }
  let modalState = true;
  function toggleModal() {
    modalState = !modalState;
  }
</script>

{#if modalState}
  <div class="profile-modal">
    <div class="content-wrapper">
      <ProfileModal />
      <button on:click={() => toggleModal()}>&times;</button>
    </div>
  </div>
{/if}

<nav class="nav">
  <div class="brand">Knowbia</div>

  <button class="profile" on:click={openDropdown}>{user.firstname}</button>
  <div class="dropdown {show}">
    <button on:click={() => toggleModal()}>Profile</button>
    <button class="logout" on:click={logout}>Logout</button>
  </div>
</nav>

<style lang="scss">
  .profile-modal {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    inset: 0;
    background-color: var(--background);
    backdrop-filter: blur(3px);
    box-shadow: var(--shadow);
    border-radius: 0 0 1rem 1rem;
    animation: show 0.2s;
  }
  .content-wrapper {
    position: relative;
  }
  .content-wrapper button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    background-color: var(--background);
    color: var(--text);
    transition: background-color 0.3s;
    &:hover {
      background-color: var(--hover);
    }
  }
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    height: 4rem;
    background-color: var(--background);
    box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid var(--border);
    border-bottom-right-radius: 1rem;
    margin-right: 1rem;
  }
  .brand {
    font-size: 2rem;
    font-weight: bold;
    color: var(--text);
  }
  .profile {
    color: var(--text);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: bold;
    transition:
      background-color 0.3s,
      transform 0.3s;
    border-radius: 0.2rem;
    &:hover {
      background-color: var(--hover);
      transform: scale(1.1);
    }
  }
  .dropdown {
    display: none;
    position: absolute;
    z-index: 1;
    top: 4rem;
    padding: 1rem;
    right: 2rem;
    background-color: var(--background);
    backdrop-filter: blur(5px);
    box-shadow: var(--shadow);
    border-radius: 0 0 1rem 1rem;
    animation: show 0.2s;
    button {
      color: var(--text);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  }
  @keyframes show {
    from {
      opacity: 0;
      transform: translateY(-1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .show {
    display: block;
  }
</style>
