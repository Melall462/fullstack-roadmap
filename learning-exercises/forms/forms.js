// Forms

// preventDefault() stop the page from reloading after submiting

// const form = document.querySelector("form");

// form.addEventListener("submit", function(event) {
//     event.preventDefault()
// })

// Reading values

// const nameInput = document.getElementById("name")
// const emailInput = document.getElementById("email")
// const ageInput = document.getElementById("age")

// form.addEventListener("submit", function() {
//     console.log(`Name: ${nameInput.value}, Email: ${emailInput.value}, Age: ${ageInput.value}`)
// })

// Basic validation

// if (nameInput.value === "") {
//     console.log("Name field is empty.")
// }

// if (emailInput.value === "") {
//     console.log("Email field is empty.")
// }

// if (ageInput.value === "") {
//     console.log("Age field is empty.")
// }

// HTML's built in verification
// Look at index.html

// Regex and .test()

// Regex - means "a digit for 0-9"
// /[0-9]/

// .test() ask wether there is a patern
// /[0-9]/.test(passwordInput.value)

// Exercises

const detailsForm = document.getElementById("detailsForm");

const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const ageInput = document.getElementById("age")

detailsForm.addEventListener("submit", function(event) {
    event.preventDefault()

    console.log(`Name: ${nameInput.value}, Email: ${emailInput.value}, Age: ${ageInput.value}`)
})

const passwordForm = document.getElementById("passwordForm");

const passwordInput = document.getElementById("password")
const lengthCheck = document.getElementById("lengthCheck")
const numberCheck = document.getElementById("numberCheck")
const caseCheck = document.getElementById("caseCheck")

passwordForm.addEventListener("submit", function(event) {
    event.preventDefault()
})

passwordInput.addEventListener("input", function() {
    if (passwordInput.value.length >= 8) {
        lengthCheck.textContent = "✓ At least 8 characters"
    } else {
        lengthCheck.textContent = "☐ At least 8 characters"
    }

    if (/[0-9]/.test(passwordInput.value)) {
        numberCheck.textContent = "✓ Contains a number"
    } else {
        numberCheck.textContent = "☐ Contains a number"
    }

    if (/[A-Z]/.test(passwordInput.value)) {
        caseCheck.textContent = "✓ Contains an uppercase letter"
    } else {
        caseCheck.textContent = "☐ Contains an uppercase letter"
    }
});

const emailForm = document.getElementById("emailForm")

const contactNameInput = document.getElementById("nameInput")
const contactEmailInput = document.getElementById("emailInput")
const contactSubjectInput = document.getElementById("subjectInput")
const contactMessageInput = document.getElementById("messageInput")
const nameCheck = document.getElementById("nameCheck")
const emailCheck = document.getElementById("emailCheck")
const subjectCheck = document.getElementById("subjectCheck")
const messageCheck = document.getElementById("messageCheck")

emailForm.addEventListener("submit", function(event) {
    event.preventDefault()

    let hasErrors = false

    if (contactNameInput.value === "") {
        nameCheck.textContent = "Name not valid"
        hasErrors = true
    } else {
        nameCheck.textContent = ""
    }

    if (!/@/.test(contactEmailInput.value)) {
        emailCheck.textContent = "Email not valid"
        hasErrors = true
    } else {
        emailCheck.textContent = ""
    }

    if (contactSubjectInput.value === "") {
        subjectCheck.textContent = "Must contain subject"
        hasErrors = true
    } else {
        subjectCheck.textContent = ""
    }

    if (contactMessageInput.value.length < 20) {
        messageCheck.textContent = "Message must be at least 20 characters"
        hasErrors = true
    } else {
        messageCheck.textContent = ""
    }

    if (!hasErrors) {
        console.log("Form submitted successfully!")

        contactNameInput.value = ""
        contactEmailInput.value = ""
        contactSubjectInput.value = ""
        contactMessageInput.value = ""
    }
})
