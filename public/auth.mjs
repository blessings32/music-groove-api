const httpPostRequster = (type, body, bodyType = "text") => {
  const ngrok = "https://localhost:3000/";
  let dataFromServer = "";
  let address = ngrok + type; // || "https://localhost:3000/")
  if (bodyType === "text") {
    return fetch(address, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bodyContent: body,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        dataFromServer = data;
        return Promise.resolve(dataFromServer);
      })
      .catch((error) => console.log(error));
  } else if (bodyType === "rawData") {
    return fetch(address, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        dataFromServer = data;
        return Promise.resolve(dataFromServer);
      })
      .catch((error) => console.log(error));
  }
};

const login = document.forms["loginForm"];
const register = document.forms["registerForm"];
login.password.addEventListener("input", () => {
  login.password.setCustomValidity("");
  login.username.setCustomValidity("");
});
login.username.addEventListener("input", () => {
  login.username.setCustomValidity("");
  login.password.setCustomValidity("");
});
function handleLogin() {
  const username = login.username.value;
  const password = login.password.value;
  login.username.setCustomValidity("");
  login.password.setCustomValidity("");
  if (username === "" || password === "") {
    login.username.setCustomValidity("Please fill out this field");
    login.password.setCustomValidity("Please fill out this field");
    login.username.reportValidity();
    login.password.reportValidity();
    return;
  } else {
    console.log("Sending login request");
    httpPostRequster(
      "api/auth/login",
      {
        username: username,
        password: password,
        timestamp: new Date().toISOString(),
      },
      "rawData"
    )
      .then((data) => {
        if (data.status === "success") {
          console.log("Login successful");
          document.location.href = "/home";
        } else {
          console.log("Login failed:", data.message);
          login.username.setCustomValidity(data.message);
          login.password.setCustomValidity(data.message);
          login.username.reportValidity();
          login.password.reportValidity();
          return;
        }
      })
      .catch((error) => console.error("Login error:", error));
  }
}

function handleRegister() {
  register.username.setCustomValidity("");
  register.email.setCustomValidity("");
  register.password.setCustomValidity("");
  register.confirmPassword.setCustomValidity("");

  let username = register.username.value;
  let email = register.email.value;
  let password = register.password.value;
  let confirmPassword = register.confirmPassword.value;
  console.log("Registering user:", username, "\n", email);
  if (password !== confirmPassword) {
    register.confirmPassword.setCustomValidity("Passwords do not match");
    register.confirmPassword.reportValidity();
    register.password.setCustomValidity("Passwords do not match");
    register.password.reportValidity();

    return;
  } else if (username === "" || email === "" || password === "") {
    register.username.setCustomValidity("Please fill out this field");
    register.email.setCustomValidity("Please fill out this field");
    register.password.setCustomValidity("Please fill out this field");
    register.username.reportValidity();
    register.email.reportValidity();
    register.password.reportValidity();
    return;
  } else {
    httpPostRequster(
      "api/auth/register",
      {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        timestamp: new Date().toISOString(),
      },
      "rawData"
    )
      .then((data) => {
        if (data.status === "success") {
          console.log("Registration successful");
          document.location.href = "/home";
        } else {
          console.log("Registration failed:", data.message);
          register.username.setCustomValidity(data.message);
          register.email.setCustomValidity(data.message);
          register.password.setCustomValidity(data.message);
          register.confirmPassword.setCustomValidity(data.message);
          register.username.reportValidity();
          register.email.reportValidity();
          register.password.reportValidity();
          register.confirmPassword.reportValidity();
        }
      })
      .catch((error) => console.error("Registration error:", error));
  }
}
register.addEventListener("submit", (event) => {
  event.preventDefault();
  handleRegister();
});
register.username.addEventListener("input", () => {
  register.username.setCustomValidity("");
});
register.email.addEventListener("input", () => {
  register.email.setCustomValidity("");
});
register.password.addEventListener("input", () => {
  register.password.setCustomValidity("");
});
register.confirmPassword.addEventListener("input", () => {
  register.confirmPassword.setCustomValidity("");
});

login.addEventListener("submit", (event) => {
  event.preventDefault();
  handleLogin();
});
