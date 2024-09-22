<script lang="ts">
  import {
    Avatar,
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
    DarkMode,
    Tooltip,
  } from "flowbite-svelte";

  import {
    SunSolid,
    MoonSolid,
    BellSolid,
    EyeSolid,
  } from "flowbite-svelte-icons";
  export let logout: () => void;

  // Retrieve user info from localStorage
  let user = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    email: "",
  };

  import "../assets/tailwind.css";
</script>

<nav class="nav">
  <h1 class="brand">Knowbia</h1>
  <div class="buttons-container flex flex-row gap-2">
    <DarkMode class="dark:text-primary-600 border dark:border-gray-800 z-50">
      <SunSolid slot="lightIcon" color="yellow" />
      <MoonSolid slot="darkIcon" />
    </DarkMode>
    <Tooltip>Toggle Theme</Tooltip>

    <div
      id="bell"
      class="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
    >
      <BellSolid class="w-8 h-8" />
      <div class="flex relative">
        <div
          class="inline-flex relative -top-2 end-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
        ></div>
      </div>
    </div>

    <Tooltip>Notifications</Tooltip>
    <Dropdown
      triggeredBy="#bell"
      class="w-full max-w-sm rounded divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700"
    >
      <div slot="header" class="text-center py-2 font-bold">Notifications</div>
      <DropdownItem class="flex space-x-4 rtl:space-x-reverse">
        <Avatar dot={{ color: "bg-gray-300" }} rounded />
        <div class="ps-3 w-full">
          <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
            New message from <span
              class="font-semibold text-gray-900 dark:text-white"
              >Jese Leos</span
            >
            : "Hey, what's up? All set for the presentation?"
          </div>
          <div class="text-xs text-primary-600 dark:text-primary-500">
            a few moments ago
          </div>
        </div>
      </DropdownItem>
      <DropdownItem class="flex space-x-4 rtl:space-x-reverse">
        <Avatar dot={{ color: "bg-red-400" }} rounded />
        <div class="ps-3 w-full">
          <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
            <span class="font-semibold text-gray-900 dark:text-white"
              >Joseph Mcfall</span
            >
            and
            <span class="font-medium text-gray-900 dark:text-white"
              >5 others</span
            >
            started following you.
          </div>
          <div class="text-xs text-primary-600 dark:text-primary-500">
            10 minutes ago
          </div>
        </div>
      </DropdownItem>
      <DropdownItem class="flex space-x-4 rtl:space-x-reverse">
        <Avatar dot={{ color: "bg-green-400" }} rounded />
        <div class="ps-3 w-full">
          <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
            <span class="font-semibold text-gray-900 dark:text-white"
              >Bonnie Green</span
            >
            and
            <span class="font-medium text-gray-900 dark:text-white"
              >141 others</span
            >
            love your story. See it and view more stories.
          </div>
          <div class="text-xs text-primary-600 dark:text-primary-500">
            44 minutes ago
          </div>
        </div>
      </DropdownItem>
      <a
        slot="footer"
        href="/"
        class="block py-2 -my-1 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
      >
        <div class="inline-flex items-center">
          <EyeSolid class="me-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          View all
        </div>
      </a>
    </Dropdown>

    <Avatar class="cursor-pointer" id="user-drop" />
    <Tooltip>Profile</Tooltip>
    <Dropdown triggeredBy="#user-drop" class="shadow-sm">
      <DropdownHeader>
        <span class="block text-sm">{user.firstname} {user.lastname}</span>
        <span class="block truncate text-sm font-medium">{user.email}</span>
      </DropdownHeader>
      <DropdownItem>Dashboard</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Earnings</DropdownItem>
      <DropdownDivider />
      <DropdownItem on:click={logout}>Sign out</DropdownItem>
    </Dropdown>
  </div>
</nav>

<style lang="scss">
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    height: 4rem;
    background-color: var(--background);
    color: var(--text);
    border-bottom: 1px solid var(--border);
  }
  .brand {
    font-size: 1.5rem;
    font-weight: 700;
  }
</style>
