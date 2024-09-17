<script lang="ts">
  import { onMount } from 'svelte'
  import { registerTeacher } from '../scripts/registerTeacher.js'
  import { Icon } from 'svelte-icons-pack'
  import {
    FaSolidUser,
    FaAddressCard,
    FaEnvelope,
    FaSolidKey,
    FaAddressBook,
    FaCalendar,
    FaSolidPeopleGroup,
    FaSolidQuestion,
    FaCircleQuestion,
    FaEye,
    FaEyeSlash,
    FaSolidEyeSlash,
    FaSolidEye
  } from 'svelte-icons-pack/fa'

  let step = 1
  let first_name = ''
  let last_name = ''
  let email = ''
  let password = ''
  let confirm_password = ''

  let phone_number = ''
  let birthdate = ''
  let department = ''
  let security_question = ''
  let security_answer = ''

  let registrationError = ''
  let showPassword = false

  let securityQuestions = [
    'What was the name of your first pet?',
    'What is your mother’s maiden name?',
    'What was the name of your elementary school?',
    'What is your favorite book?',
    'What is the name of your favorite movie?'
  ]

  // Toggle password visibility
  function togglePasswordVisibility() {
    showPassword = !showPassword
    const passwordInput = document.getElementById('password')
    const confirmPasswordInput = document.getElementById('confirm_password')
    if (passwordInput && confirmPasswordInput) {
      passwordInput.setAttribute('type', showPassword ? 'text' : 'password')
      confirmPasswordInput.setAttribute('type', showPassword ? 'text' : 'password')
    }
  }

  $: isStep1Valid = validateStep1()
  $: isStep2Valid = validateStep2()

  let currentButton = 'next'

  $: currentButton = step === 1 ? 'next' : 'back-register'

  function goToPreviousStep() {
    if (step === 2) {
      step = 1
      saveToSessionStorage()
    }
  }

  function goToNextStep() {
    if (step === 1 && isStep1Valid) {
      step = 2
      saveToSessionStorage()
    } else if (step === 2 && isStep2Valid) {
      handleRegister()
    }
  }

  function onInputChange() {
    isStep1Valid = validateStep1()
    isStep2Valid = validateStep2()
    saveToSessionStorage()
  }

  function validateStep1() {
    return first_name && last_name && email && password && confirm_password
  }

  function validateStep2() {
    return phone_number && birthdate && department && security_question && security_answer
  }

  async function handleRegister() {
    if (password !== confirm_password) {
      registrationError = 'Passwords do not match.'
      return
    }

    const result = await registerTeacher({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      birthdate,
      department,
      security_question,
      security_answer
    })

    if (result.success) {
      registrationError = ''
      sessionStorage.removeItem('registrationData') // Clear storage on success
    } else {
      registrationError = result.message
    }
  }

  function saveToSessionStorage() {
    const formData = {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      phone_number,
      birthdate,
      department,
      security_question,
      security_answer,
      step
    }

    sessionStorage.setItem('registrationData', JSON.stringify(formData))
  }

  onMount(() => {
    const savedData = sessionStorage.getItem('registrationData')
    if (savedData) {
      const data = JSON.parse(savedData)

      first_name = data.first_name || ''
      last_name = data.last_name || ''
      email = data.email || ''
      password = data.password || ''
      confirm_password = data.confirm_password || ''
      phone_number = data.phone_number || ''
      birthdate = data.birthdate || ''
      department = data.department || ''
      security_question = data.security_question || ''
      security_answer = data.security_answer || ''

      step = data.step || 1
    }
  })

  export let onBackToLogin: () => void
</script>

{#if registrationError}
  <div class="error-message">{registrationError}</div>
{/if}

<div class="container">
  <div class="register-form">
    <h1>Teacher Registration</h1>

    {#if step === 1}
      <!-- Step 1 Fields -->
      <div class="input_fields">
        <label for="first_name">First Name</label>
        <div class="inputs">
          <Icon src={FaAddressCard} />
          <input
            type="text"
            id="first_name"
            bind:value={first_name}
            on:input={onInputChange}
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="last_name">Last Name</label>
        <div class="inputs">
          <Icon src={FaAddressCard} />
          <input
            type="text"
            id="last_name"
            bind:value={last_name}
            on:input={onInputChange}
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="email">Email</label>
        <div class="inputs">
          <Icon src={FaEnvelope} />
          <input type="email" id="email" bind:value={email} on:input={onInputChange} required />
        </div>
      </div>
      <div class="input_fields">
        <label for="password">Password</label>
        <div class="inputs">
          <Icon src={FaSolidKey} />
          <input
            type="password"
            id="password"
            bind:value={password}
            on:input={onInputChange}
            required
          />
          <button on:click={togglePasswordVisibility} tabindex="-1">
            <Icon src={showPassword ? FaSolidEye : FaSolidEyeSlash} />
          </button>
        </div>
      </div>
      <div class="input_fields">
        <label for="confirm_password">Confirm Password</label>
        <div class="inputs">
          <Icon src={FaSolidKey} />
          <input
            type="password"
            id="confirm_password"
            bind:value={confirm_password}
            on:input={onInputChange}
            required
          />
          <button on:click={togglePasswordVisibility} tabindex="-1">
            <Icon src={showPassword ? FaSolidEye : FaSolidEyeSlash} />
          </button>
        </div>
      </div>
    {/if}

    {#if step === 2}
      <!-- Step 2 Fields -->
      <div class="input_fields">
        <label for="phone_number">Phone Number</label>
        <div class="inputs">
          <Icon src={FaAddressBook} />
          <input
            type="text"
            id="phone_number"
            bind:value={phone_number}
            on:input={onInputChange}
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="birthdate">Birthdate</label>
        <div class="inputs">
          <Icon src={FaCalendar} />
          <input
            type="date"
            id="birthdate"
            bind:value={birthdate}
            on:input={onInputChange}
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="department">Department</label>
        <div class="inputs">
          <Icon src={FaSolidPeopleGroup} />
          <input
            type="text"
            id="department"
            bind:value={department}
            on:input={onInputChange}
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="security_question">Security Question</label>
        <div class="inputs">
          <Icon src={FaSolidQuestion} />
          <select
            id="security_question"
            bind:value={security_question}
            on:change={onInputChange}
            required
          >
            <option value="" disabled>Select a question</option>
            {#each securityQuestions as question}
              <option value={question}>{question}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="input_fields">
        <label for="security_answer">Security Answer</label>
        <div class="inputs">
          <Icon src={FaCircleQuestion} />
          <input
            type="text"
            id="security_answer"
            bind:value={security_answer}
            on:input={onInputChange}
            required
          />
        </div>
      </div>
    {/if}
    <!-- Dynamic button rendering based on currentButton -->
    {#if currentButton === 'next'}
      <button on:click={goToNextStep} disabled={!isStep1Valid} id="nextButton">Next</button>
    {/if}

    {#if currentButton === 'back-register'}
      <button on:click={goToPreviousStep} id="backButton">Back</button>
      <button on:click={goToNextStep} disabled={!isStep2Valid} id="registerButton">Register</button>
    {/if}

    <div class="separator">
      <div class="line"></div>
      <div class="or">or</div>
      <div class="line"></div>
    </div>
    <button on:click={onBackToLogin} id="backToLogin">Back to Login</button>
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    min-height: 100vh;
  }

  .separator {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    .line {
      flex: 1;
      height: 1px;
      background-color: #ccc;
    }
    .or {
      padding: 0.5rem;
    }
  }
  .register-form {
    background: transparent;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.25);
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    width: 60vw;
    max-width: 600px;
    padding: 5rem;
    box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.1);
    gap: 0.5rem;
  }

  .register-form h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .input_fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .inputs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      padding: 0.3rem 1rem;
      border-radius: 0.5rem;
      align-items: center;
      width: 100%;
      gap: 0.5rem;
      input {
        margin-left: 0.3rem;
        flex-grow: 1;
        background: none;
        padding: 0.5rem;
        border: none;
        border-left: 1px solid #ccc;
        &:focus {
          outline: none;
        }
      }
      button {
        background: none;
        border: none;
        cursor: pointer;
      }
    }
  }

  #nextButton,
  #registerButton {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 1rem 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 1rem;
  }

  #nextButton:disabled,
  #registerButton:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .error-message {
    position: absolute;
    background-color: #f8d7da;
    padding: 1rem;
    border-radius: 0.5rem;
    color: red;
    text-align: center;
    margin-bottom: 1rem;
    animation: popdown 10s;
  }

  @keyframes popdown {
    0% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  #backButton {
    background-color: #cccccc;
    color: white;
    border: none;
    padding: 1rem 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 1rem;
    &:hover {
      background-color: #0056b3;
    }
  }
  #security_question {
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background: none;
    &:focus {
      outline: none;
    }
  }
  #backToLogin {
    margin-top: 1rem;
    border: none;
    padding: 1rem 0.5rem;
    background-color: transparent;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
