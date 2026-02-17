// SIGNUP
function signup() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  const user = {
    email: email,
    password: password
  };

  localStorage.setItem("baltrixUser", JSON.stringify(user));

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
}

// LOGIN
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const storedUser = JSON.parse(localStorage.getItem("baltrixUser"));

  if (!storedUser) {
    document.getElementById("login-error").innerText = "No account found. Please sign up.";
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    window.location.href = "index.html";
  } else {
    document.getElementById("login-error").innerText = "Invalid credentials.";
  }
}
