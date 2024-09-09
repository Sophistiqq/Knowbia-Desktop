<script>
  import { Classes, Quizzes, StudentsInfo } from './pages/'
  import NavBar from './components/NavBar.svelte'
  import TopBar from './components/TopBar.svelte'
  let currentPage = 'classes'

  const pages = {
    classes: Classes,
    quizzes: Quizzes,
    studentsInfo: StudentsInfo
  }

  function navigate(page) {
    currentPage = page
  }
</script>

<TopBar />
<div class="container">
  <NavBar {navigate} />
  <main class="screen">
    <svelte:component this={pages[currentPage]} />
  </main>
</div>

<style>
  .container {
    display: flex;
    height: calc(100vh - 4rem);
  }
  .screen {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }
</style>
