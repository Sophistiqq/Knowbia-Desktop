<script>
  export let navigate
  import { Icon } from 'svelte-icons-pack'
  import { FaSolidBook, FaSolidNotesMedical, FaAddressCard } from 'svelte-icons-pack/fa'
</script>

<nav>
  <button on:click={() => navigate('classes')}><Icon src={FaSolidBook} size="32" />Classes</button>
  <button on:click={() => navigate('quizzes')}
    ><Icon src={FaSolidNotesMedical} size="32" />Quizzes</button
  >
  <button on:click={() => navigate('studentsInfo')}
    ><Icon src={FaAddressCard} size="32" />Student's Info</button
  >
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 10vw;
    background-color: transparent;
    border-right: 1px solid var(--primary-color);
    padding-top: 1rem;
  }
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    font-size: 1rem;
    font-weight: 600;
    padding: 2rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    &:hover {
      background-color: var(--accent-color);
    }
    &:active {
      background-color: var(--active-color);
      transform: translateY(2px);
    }
  }
</style>
