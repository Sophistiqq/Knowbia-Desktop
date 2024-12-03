<script lang="ts">
  // get the user info from localStorage
  let user = JSON.parse(localStorage.getItem("user")) || {
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
  };
</script>

<div class="modal-content">
  <h2>Profile</h2>
  <label for="name">Name</label>
  <input
    type="text"
    id="name"
    name="name"
    value="{user.firstname} {user.lastname}"
    disabled
  />
  <label for="email">Email</label>
  <input type="email" id="email" name="email" value={user.email} disabled />
  <label for="phone">Phone Number</label>
  <input type="text" id="name" name="name" value={user.phone_number} />
  <div class="button-group">
    <button id="change-password" class="btn">Change Password</button>
    <button id="delete-account" class="btn btn-danger">Delete Account</button>
  </div>

  <style lang="scss">
    .button-group {
      display: flex;
      justify-content: space-between;
    }
  </style>
</div>

<style lang="scss">
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
  h2 {
    margin-bottom: 1rem;
    color: var(--text);
    font-size: 2rem;
    font-weight: bold;
  }
  .modal-content {
    position: relative;
    padding: 3rem;
    background-color: var(--background-dark);
    border-radius: 1rem;
    backdrop-filter: blur(25px);
    border: 1px solid var(--border);
    width: 30rem;
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text);
      font-size: 1.2rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid var(--border);
      border-radius: 0.2rem;
      background-color: var(--background);
      color: var(--text);
    }
  }
  .btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    margin-top: 1rem;
    border: none;
    border-radius: 0.2rem;
    background-color: var(--background);
    color: var(--text-light);
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
  }
  .btn-danger {
    background-color: var(--secondary);
  }
</style>
