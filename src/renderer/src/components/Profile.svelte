<script lang="ts">
</script>


<style lang="scss">
  .profile {
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
</style>
