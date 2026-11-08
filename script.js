const form = document.getElementById("registrationForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const showPasswordCheckbox = document.getElementById("showPassword");

const message = document.getElementById("message");

const allInputs = [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput];

// Show or hide both password fields
showPasswordCheckbox.addEventListener("change", function () {
    const type = showPasswordCheckbox.checked ? "text" : "password";
    passwordInput.type = type;
    confirmPasswordInput.type = type;
});

// Remove an error as soon as the student starts correcting the field
allInputs.forEach(function (input) {
    input.addEventListener("input", function () {
        clearError(input);
        clearMessage();
    });
});

// Form submission
form.addEventListener("submit", async function (event) {

    // Prevent page from refreshing
    event.preventDefault();
    clearMessage();

    // Get values entered by the student
    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let firstInvalid = null;

    // Helper: record an error and remember the first invalid field
    function fail(input, text) {
        setError(input, text);
        if (!firstInvalid) firstInvalid = input;
    }

    // Check name
    if (name === "") {
        fail(nameInput, "Full name is required.");
    } else if (name.length < 3) {
        fail(nameInput, "Name must contain at least 3 characters.");
    } else if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(name)) {
        fail(nameInput, "Name can only contain letters and spaces.");
    } else {
        clearError(nameInput);
    }

    // Check email
    if (email === "") {
        fail(emailInput, "Email address is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        fail(emailInput, "Enter a valid email address (e.g. name@gmail.com).");
    } else {
        clearError(emailInput);
    }

    // Check phone number
    if (phone === "") {
        fail(phoneInput, "Phone number is required.");
    } else if (!/^[0-9]{10}$/.test(phone)) {
        fail(phoneInput, "Enter a valid 10-digit phone number.");
    } else {
        clearError(phoneInput);
    }

    // Check password
    if (password === "") {
        fail(passwordInput, "Password is required.");
    } else if (password.length < 8 ||
               !/[A-Z]/.test(password) ||
               !/[0-9]/.test(password)) {
        fail(passwordInput,
             "Password must contain 8 characters, one uppercase letter and one number.");
    } else {
        clearError(passwordInput);
    }

    // Check password matching
    if (confirmPassword === "") {
        fail(confirmPasswordInput, "Please confirm your password.");
    } else if (password !== confirmPassword) {
        fail(confirmPasswordInput, "Passwords do not match!");
    } else {
        clearError(confirmPasswordInput);
    }

    // Stop if anything is invalid
    if (firstInvalid) {
        showMessage("Please fix the errors above and try again.", "error");
        firstInvalid.focus();
        return;
    }

    // Check if this email is already registered
    const students = getStudents();
    if (students.some(function (s) { return s.email === email; })) {
        setError(emailInput, "This email is already registered.");
        showMessage("An account with this email already exists. Please login.", "error");
        emailInput.focus();
        return;
    }

    // Save the student (password is stored as a hash, not plain text)
    try {
        students.push({
            name: name,
            email: email,
            phone: phone,
            passwordHash: await hashPassword(password)
        });
        saveStudents(students);
    } catch (error) {
        console.error(error);
        showMessage("Could not save your account. Please open the site with Live Server and allow site storage.", "error");
        return;
    }

    // Successful registration
    showMessage("Registration successful! Welcome, " + name + "!", "success");

    form.reset();
    passwordInput.type = "password";
    confirmPasswordInput.type = "password";
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
