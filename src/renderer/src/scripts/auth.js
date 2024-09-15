export async function login(student_number, password) {
  if (!student_number || !password) {
    return { success: false, message: 'Please fill in both fields.' };
  }

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_number, password }),
      credentials: 'include'
    });

    if (response.ok) {
      return { success: true };
    } else {
      const result = await response.json();
      return { success: false, message: result.message || 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'An error occurred while trying to log in.' };
  }
}


export async function checkAuth() {
  try {
    const response = await fetch('http://localhost:3000/auth/authenticate', {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error('Error:', error);
    return { isAuthenticated: false };
  }
}
