export async function registerTeacher(teacherData) {
  const {
    first_name,
    last_name,
    email,
    password,
    confirmPassword,
    phone_number,
    address,
    birthdate, // Mandatory
    department, // Mandatory
    profile_picture,
    security_question,
    security_answer,
  } = teacherData;

  // Basic input validation
  if (!first_name || !last_name || !email || !password || !confirmPassword || !phone_number || !birthdate || !department || !security_question || !security_answer) {
    return { success: false, message: 'Please fill in all mandatory fields.' };
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match.' };
  }

  // Try sending a request to the backend API
  try {
    const response = await fetch('http://localhost:3000/auth/register-teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        phone_number,
        address,
        birthdate,
        department,
        profile_picture,
        security_question,
        security_answer,
      }),
      credentials: 'include',
    });

    // Handle the server response
    if (response.ok) {
      return { success: true, message: 'Registration successful. Please verify your email.' };
    } else {
      const result = await response.json();
      return { success: false, message: result.message || 'Registration failed.' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'An error occurred during registration.' };
  }
}



