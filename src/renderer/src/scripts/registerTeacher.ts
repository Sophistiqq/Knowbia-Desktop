export async function registerTeacher(teacherData: any) {
  console.table(teacherData);
  try {
    const response = await fetch("http://localhost:3000/teacher/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error registering teacher:", error);
    return { error: error.message, success: false };
  }
}

export default registerTeacher;
