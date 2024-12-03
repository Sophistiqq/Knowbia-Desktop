<script lang="ts">
  import { onMount } from "svelte";
  import { registerTeacher } from "../scripts/registerTeacher";
  import { Icon } from "svelte-icons-pack";
  import { Toast } from "flowbite-svelte";
  import {
    FaAddressCard,
    FaEnvelope,
    FaSolidKey,
    FaAddressBook,
    FaSolidQuestion,
    FaCircleQuestion,
    FaEye,
    FaEyeSlash,
    FaSolidEyeSlash,
    FaSolidEye,
  } from "svelte-icons-pack/fa";
  let step = 1;
  let firstname = "";
  let lastname = "";
  let middlename = "";
  let email = "";
  let password = "";
  let confirm_password = "";

  let phone_number = "";
  let security_question = "";
  let security_answer = "";

  let registrationError = "";
  let showPassword = false;

  let securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother’s maiden name?",
    "What was the name of your elementary school?",
    "What is your favorite book?",
    "What is the name of your favorite movie?",
  ];

  // Toggle password visibility
  function togglePasswordVisibility() {
    showPassword = !showPassword;
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    if (passwordInput && confirmPasswordInput) {
      passwordInput.setAttribute("type", showPassword ? "text" : "password");
      confirmPasswordInput.setAttribute(
        "type",
        showPassword ? "text" : "password",
      );
    }
  }
  function debounce(func: Function, timeout = 300) {
    let timer: number | undefined; // Set the timer to number

    return (...args: any[]) => {
      if (timer) {
        clearTimeout(timer); // Clear the existing timer
      }
      // Cast the setTimeout return value to number
      timer = window.setTimeout(() => {
        func.apply(this, args);
      }, timeout) as unknown as number;
    };
  }

  $: isStep1Valid = validateStep1();
  $: isStep2Valid = validateStep2();

  let currentButton = "next";

  $: currentButton = step === 1 ? "next" : "back-register";

  function goToPreviousStep() {
    if (step === 2) {
      step = 1;
      saveToLocalStorage();
    }
  }

  function goToNextStep() {
    if (step === 1 && isStep1Valid) {
      step = 2;
      saveToLocalStorage();
    } else if (step === 2 && isStep2Valid) {
      handleRegister();
    }
  }

  function onInputChange() {
    isStep1Valid = validateStep1();
    isStep2Valid = validateStep2();
    saveToLocalStorage();
  }

  function validateStep1() {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}/;

    const isValidEmail = emailPattern.test(email);
    const isValidPassword = passwordPattern.test(password);
    const isPasswordMatch = password === confirm_password;

    return (
      firstname.trim().length > 0 &&
      lastname.trim().length > 0 &&
      middlename.trim().length > 0 &&
      isValidEmail &&
      isValidPassword &&
      isPasswordMatch
    );
  }

  function validateStep2() {
    return (
      security_question.trim().length > 0 && security_answer.trim().length > 0
    );
  }

  const debouncedInputChange = debounce(onInputChange);

  async function handleRegister() {
    console.log("Registering with:", firstname, lastname, email); // Check if values are correct here
    if (password !== confirm_password) {
      registrationError = "Passwords do not match.";
      return;
    }

    console.log("Phone number:", phone_number); // Log the phone number
    const result = await registerTeacher({
      firstname,
      lastname,
      middlename,
      email,
      password,
      phone_number,
      security_question,
      security_answer,
    });

    if (result.success) {
      registrationError = result.message;
      clearForm();
      localStorage.removeItem("registrationData"); // Clear storage on success
    } else {
      registrationError = result.message;
    }
  }

  function clearForm() {
    firstname = "";
    lastname = "";
    middlename = "";
    email = "";
    password = "";
    confirm_password = "";
    phone_number = "";
    security_question = "";
    security_answer = "";
    step = 1;
  }

  function saveToLocalStorage() {
    const formData = {
      firstname,
      lastname,
      middlename,
      email,
      password,
      confirm_password,
      phone_number,
      security_question,
      security_answer,
      step,
    };

    sessionStorage.setItem("registrationData", JSON.stringify(formData));
  }

  onMount(() => {
    const savedData = sessionStorage.getItem("registrationData");
    if (savedData) {
      const data = JSON.parse(savedData);

      firstname = data.firstname || "";
      lastname = data.lastname || "";
      middlename = data.middlename || "";
      email = data.email || "";
      password = data.password || "";
      confirm_password = data.confirm_password || "";
      phone_number = data.phone_number || "";
      security_question = data.security_question || "";
      security_answer = data.security_answer || "";

      step = data.step || 1;
    }
  });

  export let onBackToLogin: () => void;
</script>

{#if registrationError}
  <Toast position="top-right" class="z-30">
    <svelte:fragment slot="icon"></svelte:fragment>
    {registrationError}
  </Toast>
{/if}

<div class="container">
  <div class="register-form">
    <h1>Teacher Registration</h1>

    {#if step === 1}
      <!-- Step 1 Fields -->
      <div class="input_fields">
        <label for="firstname">First Name</label>
        <div class="inputs">
          <Icon src={FaAddressCard} />
          <input
            type="text"
            id="firstname"
            bind:value={firstname}
            on:input={debouncedInputChange}
            pattern="[a-zA-Z]+"
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="lastname">Last Name</label>
        <div class="inputs">
          <Icon src={FaAddressCard} />
          <input
            type="text"
            id="lastname"
            bind:value={lastname}
            on:input={debouncedInputChange}
            pattern="[a-zA-Z]+"
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="middlename">Middle Name</label>
        <div class="inputs">
          <Icon src={FaAddressCard} />
          <input
            type="text"
            id="middlename"
            bind:value={middlename}
            on:input={debouncedInputChange}
            pattern="[a-zA-Z]+"
            required
          />
        </div>
      </div>
      <div class="input_fields">
        <label for="email">Email</label>
        <div class="inputs">
          <Icon src={FaEnvelope} />
          <input
            type="email"
            id="email"
            bind:value={email}
            on:input={debouncedInputChange}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{4}$"
            required
          />
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
            on:input={debouncedInputChange}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}"
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
            on:input={debouncedInputChange}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}"
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
            on:input={debouncedInputChange}
            pattern="^(09|\+639)\d{9}$"
            title="Phone number should start with 09 or +639 and followed by 9 digits"
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
            on:input={debouncedInputChange}
            required
          />
        </div>
      </div>
    {/if}
    <!-- Dynamic button rendering based on currentButton -->
    {#if currentButton === "next"}
      <button on:click={goToNextStep} disabled={!isStep1Valid} id="nextButton"
        >Next</button
      >
    {/if}

    {#if currentButton === "back-register"}
      <button on:click={goToPreviousStep} id="backButton">Back</button>
      <button
        on:click={goToNextStep}
        disabled={!isStep2Valid}
        id="registerButton">Register</button
      >
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
    justify-content: center;
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
      background-color: var(--border);
    }
    .or {
      color: var(--text);
      padding: 0.5rem;
    }
  }
  .register-form {
    color: var(--text);
    background: var(--background);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(8px);
    border: 2px solid rgba(255, 255, 255, 0.18);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 1rem;
    height: 95vh;
    width: 60vw;
    max-width: 600px;
    padding: 5rem;
    gap: 0.5rem;
    & label {
      color: var(--text);
    }
    & h1 {
      text-align: center;
      margin-bottom: 1rem;
      font-weight: 600;
      font-size: 2rem;
      color: var(--text);
    }
  }

  .input_fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    & label {
      font-size: 1.2rem;
    }
    .inputs {
      display: flex;
      justify-content: space-between;
      background: var(--background);
      align-items: center;
      border: 1px solid var(--border);
      padding: 0.3rem 1rem;
      border-radius: 0.5rem;
      align-items: center;
      gap: 0.5rem;
      & button {
        border: none;
        cursor: pointer;
      }
      & input {
        outline: none;
        margin-left: 0.3rem;
        flex-grow: 1;
        color: var(--text);
        background: transparent;
        padding: 0.5rem;
        border: none;
        border-left: 1px solid var(--border);
        &:focus {
          outline: none;
        }
      }
    }
  }

  #nextButton,
  #registerButton {
    color: var(--text);
    border: 1px solid var(--border);
    backdrop-filter: blur(50px) zoom(1.1);
    font-weight: 700;
    padding: 1rem 0.5rem;
    margin-top: 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
      background-color: var(--border);
    }
    &:active {
      border: 1px solid var(--active);
      background-color: var(--active);
    }
  }

  #nextButton:disabled,
  #registerButton:disabled {
    background-color: var(--active);
    border: none;
    cursor: not-allowed;
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
    color: var(--text);
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
    font-weight: 700;
    padding: 1rem 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 1.5rem;
    transition: background-color 0.5s;
    &:hover {
      background-color: var(--border);
    }
    &:active {
      background-color: var(--active);
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
    color: var(--text);
    &:hover {
      text-decoration: underline;
      color: var(--border);
    }
  }
</style>
