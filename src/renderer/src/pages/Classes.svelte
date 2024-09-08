<div class="classes-wrapper">
  <h1>Classes</h1>
  <!-- The classes page content goes here -->
  <!-- The classes have contents like how google classroom ui's -->

  <div class="class">
    <div class="subject">Subject Name</div>
    <div class="description">Description of the subject</div>
    <div class="profName">Professor's name</div>
  </div>
</div>

<style>
  .classes-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .class {
    display: flex;
    flex-direction: column;
    background-color: var(--active-color);
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--primary-color);
    border-radius: 0.5rem;
  }
</style>
