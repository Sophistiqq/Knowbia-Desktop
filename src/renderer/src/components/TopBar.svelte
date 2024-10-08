<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
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
</script>

<nav class="nav">
  <div class="brand">Knowbia</div>

  <button class="profile" on:click={openDropdown}>{user.firstname}</button>
  <div class="dropdown {show}">
    <button class="logout" on:click={logout}>Logout</button>
  </div>
</nav>

<style lang="scss">
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    height: 4rem;
    background-color: white;
    border: 2px solid var(--text);
    color: var(--text);
    margin: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: 4px 6px 0px 0px var(--text);
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
    transition: background-color 0.3s;
    &:hover {
      background-color: var(--accent);
    }
  }
  .dropdown {
    display: none;
    position: absolute;
    top: 4rem;
    padding: 1rem;
    right: 2rem;
    background-color: var(--accent);
    box-shadow: 2px 3px 0px 0px var(--text);
    button {
      color: var(--text);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  }
  .show {
    display: block;
  }
</style>
