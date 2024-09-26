export async function login(email, password) {
  if (!email || !password) {
    return { success: false, message: "Please fill in both fields." };
  }

  try {
    const response = await fetch("http://localhost:3000/teacher/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.token) {
        console.log("User:", result.user);
        // Store token and expiration in localStorage
        const expirationTime = Date.now() + result.expiresIn * 1000; // Assuming expiresIn is in seconds
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        localStorage.setItem("tokenExpiration", String(expirationTime));

        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || "Invalid credentials",
        };
      }
    } else {
      const result = await response.json();
      return {
        success: false,
        message: result.message || "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred while trying to log in.",
    };
  }
}

export async function checkAuth() {
  // Check token expiration
  const token = localStorage.getItem("token");
  const expiration = localStorage.getItem("tokenExpiration");

  if (token && expiration && Date.now() < parseInt(expiration)) {
    return { isAuthenticated: true };
  }

  try {
    const response = await fetch("http://localhost:3000/teacher/authenticate", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      return { isAuthenticated: true };
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error("Error:", error);
    return { isAuthenticated: false };
  }
}
