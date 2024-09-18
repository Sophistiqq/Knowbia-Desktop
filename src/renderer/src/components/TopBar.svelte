<script lang="ts">
  import {
    Navbar,
    NavBrand,
    Avatar,
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
    DarkMode,
  } from "flowbite-svelte";

  export let logout: () => void;

  // Retrieve user info from localStorage
  let user = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    email: "",
  };

  import "../assets/tailwind.css";
</script>

<Navbar rounded color="form">
  <NavBrand>
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      >Knowbia</span
    >
  </NavBrand>
  <Avatar
    id="user-drop"
    src="/images/profile-picture-3.webp"
    class="cursor-pointer"
    dot={{ color: "green" }}
  />
  <Dropdown triggeredBy="#user-drop">
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
  <DarkMode />
</Navbar>
