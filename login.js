const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const showPasswordCheckbox = document.getElementById("showpassword");
const message = document.getElementById("message");

// Show or hide password when checkbox is clicked
showPasswordCheckbox.addEventListener("change", function () {
    if (showPasswordCheckbox.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});

// Remove an error as soon as the student starts typing again
[emailInput, passwordInput].forEach(function (input) {
    input.addEventListener("input", function () {
        clearError(input);
        clearMessage();
    });
});

// Form submission
loginForm.addEventListener("submit", async function (event) {

    // Prevent page from refreshing
    event.preventDefault();
    clearMessage();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let firstInvalid = null;

    // Check email
    if (email === "") {
        setError(emailInput, "Email address is required.");
        firstInvalid = emailInput;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        setError(emailInput, "Enter a valid email address (e.g. name@gmail.com).");
        firstInvalid = emailInput;
    } else {
        clearError(emailInput);
    }

    // Check password
    if (password === "") {
        setError(passwordInput, "Password is required.");
        if (!firstInvalid) firstInvalid = passwordInput;
    } else {
        clearError(passwordInput);
    }

    if (firstInvalid) {
        showMessage("Please fix the errors above and try again.", "error");
        firstInvalid.focus();
        return;
    }

    // Look for the student in saved registrations
    const student = getStudents().find(function (s) {
        return s.email === email;
    });

    if (!student) {
        showMessage("No account found with this email. Please register first.", "error");
        return;
    }

    if (student.passwordHash !== await hashPassword(password)) {
        setError(passwordInput, "Incorrect password.");
        showMessage("Login failed. Incorrect email or password.", "error");
        passwordInput.focus();
        return;
    }

    // Successful login
    showMessage("Login successful! Welcome back, " + student.name + "!", "success");
    loginForm.reset();
    passwordInput.type = "password";
});

// Read saved students (tries localStorage, then sessionStorage, then window.name)
function getStudents() {
    const stores = [function () { return localStorage; },
                    function () { return sessionStorage; }];
    for (let i = 0; i < stores.length; i++) {
        try {
            const saved = stores[i]().getItem("students");
            if (saved) return JSON.parse(saved) || [];
        } catch (error) { /* storage blocked, try the next one */ }
    }
    try {
        if (window.name.indexOf("students:") === 0) {
            return JSON.parse(window.name.slice(9)) || [];
        }
    } catch (error) { /* ignore */ }
    return [];
}

// Save students (falls back if the browser blocks site storage)
function saveStudents(list) {
    const json = JSON.stringify(list);
    try { localStorage.setItem("students", json); return; } catch (error) { /* blocked */ }
    try { sessionStorage.setItem("students", json); return; } catch (error) { /* blocked */ }
    window.name = "students:" + json;
}

// Convert a password to a SHA-256 hash
async function hashPassword(password) {
    // SHA-256 works on localhost / HTTPS
    if (window.crypto && window.crypto.subtle) {
        const data = new TextEncoder().encode(password);
        const buffer = await window.crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(buffer))
            .map(function (b) { return b.toString(16).padStart(2, "0"); })
            .join("");
    }

    // Fallback for pages opened in an insecure context
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = (hash * 31 + password.charCodeAt(i)) | 0;
    }
    return "f" + hash;
}

// Show an error under a field
function setError(input, text) {
    document.getElementById(input.id + "Error").textContent = text;
    input.classList.add("invalid");
}

// Clear the error under a field
function clearError(input) {
    document.getElementById(input.id + "Error").textContent = "";
    input.classList.remove("invalid");
}

// Display messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

function clearMessage() {
    message.textContent = "";
    message.className = "";
}