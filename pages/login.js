import { logIn, signUp, AuthError } from "../js/auth.js";

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const nameField = document.getElementById("name-field");
const message = document.getElementById("message");
const submitButton = document.getElementById("submit-btn");
const toggleAuthModeLink = document.getElementById("toggle-auth-mode");
const formTitle = document.getElementById("form-title");
const formModeLabel = document.getElementById("form-mode-label");
const switchCopyText = document.getElementById("switch-copy-text");

let isSignupMode = false;

function setMessage(text, type = "error") {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

function setAuthMode(mode) {
  isSignupMode = mode === "signup";
  nameField.hidden = !isSignupMode;
  formTitle.textContent = isSignupMode ? "Create your account" : "Log in to your account";
  formModeLabel.textContent = isSignupMode ? "Sign up" : "Sign in";
  submitButton.textContent = isSignupMode ? "Sign up" : "Log in";
  toggleAuthModeLink.textContent = isSignupMode ? "Log in instead" : "Create one";
  switchCopyText.textContent = isSignupMode ? "Already have an account?" : "Don’t have an account?";
  if (!isSignupMode) {
    nameInput.value = "";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput?.value.trim() || "";
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    setMessage("Please enter both email and password.");
    return;
  }

  if (isSignupMode && !name) {
    setMessage("Please enter your name to create an account.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = isSignupMode ? "Signing up..." : "Logging in...";
  setMessage("");

  try {
    if (isSignupMode) {
      await signUp(name, email, password);
      setMessage("Account created successfully. Redirecting...", "success");
    } else {
      await logIn(email, password);
      setMessage("Login successful. Redirecting...", "success");
    }

    window.setTimeout(() => {
      window.location.href = "./shop.html";
    }, 700);
  } catch (error) {
    setMessage(AuthError(error));
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = isSignupMode ? "Sign up" : "Log in";
  }
});

toggleAuthModeLink.addEventListener("click", (event) => {
  event.preventDefault();
  setAuthMode(isSignupMode ? "login" : "signup");
});

setAuthMode("login");
