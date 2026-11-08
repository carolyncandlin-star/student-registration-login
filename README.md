# Student Registration and Login

A responsive student registration and login interface built with **HTML, CSS and JavaScript** for Team Avenir.

## Features

- Registration form with full name, email, phone number, password and confirm password
- Separate login page
- Form validation on every field, with clear error messages under each input
  - **Name:** required, at least 3 characters, letters only
  - **Email:** required, valid email format
  - **Phone:** required, exactly 10 digits
  - **Password:** at least 8 characters, one uppercase letter and one number
  - **Confirm password:** must match the password
- Show Password option on both pages
- Success and error messages for registration and login
  (duplicate email, unknown account, wrong password, and more)
- Responsive design for mobile and desktop

## Project Structure

```
index.html     Registration page
login.html     Login page
style.css      Styles for both pages
script.js      Registration logic and validation
login.js       Login logic and validation
screenshots/   Screenshots of the website
```

## How to Run

1. Download or clone this repository.
2. Open the folder in **VS Code**.
3. Install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**.
   (You can also open `index.html` directly in a browser.)
4. Register a new account, then click **Login here** and sign in with the same email and password.

## Screenshots

### Desktop

**Registration page**

![Registration page](screenshots/registration-page.png)

**Registration validation errors**

![Registration errors](screenshots/register-error.png)

**Registration success**

![Registration success](screenshots/register-success.png)

**Login success**

![Login success](screenshots/login-success.png)

**Login error**

![Login error](screenshots/login-error.png)

### Mobile

**Mobile registration**

![Mobile registration](screenshots/mobile-registration.png)

**Mobile login**

![Mobile login](screenshots/mobile-login.png)

## Notes

- This is a front-end project with no backend. Registered students are saved in the browser's `localStorage`, and passwords are stored as SHA-256 hashes, not plain text.
- To reset all accounts, clear the site data in your browser.

## Technologies

HTML5, CSS3, JavaScript (ES6)

## Developed By

Carolyn Gurindapalli