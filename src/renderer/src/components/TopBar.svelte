<script>
  import { Icon } from 'svelte-icons-pack'
  import { FaBell, FaUser } from 'svelte-icons-pack/fa'
</script>

<!-- The top bar of the application -->
<header>
  <h1>Knowbia</h1>

  <div class="left">
    <button class="notification">
      <Icon src={FaBell} />
    </button>
    <button class="profile">
      <Icon src={FaUser} />
      <p>John Doe</p>
    </button>
  </div>
</header>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    position: sticky;
    padding: 0 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .left {
    display: flex;
    gap: 0.5rem;
    button {
      font-weight: 600;
      padding: 1rem;
      border: none;
      background-color: var(--white-color);
      border-radius: 0.5rem;
      cursor: pointer;
      transition:
        background-color 0.5s,
        transform 0.3s;
      display: flex;
      align-items: center;
      gap: 1rem;
      &:hover {
        background-color: var(--accent-color);
      }
      &:active {
        background-color: var(--active-color);
        transform: translateY(2px);
      }
    }
  }
</style>
