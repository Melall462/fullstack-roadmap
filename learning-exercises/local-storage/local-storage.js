// Local Storage

// Storing a string

localStorage.setItem("name", "Mehar")
console.log(localStorage.getItem("name"))

// Retrieving a string

console.log(localStorage.getItem("name"))

// Changing the stored string

localStorage.setItem("name", "Angee")
console.log(localStorage.getItem("name"))

// Removing the stored string

localStorage.removeItem("name")
console.log(localStorage.getItem("name"))


// Storing a number
// Local storage only store strings

localStorage.setItem("age", 21)
const age = Number(localStorage.getItem("age")) // Convert stored string back into a number

console.log(age)
console.log(typeof age)

// Storing an array

const fruits = ["apple", "banana", "orange"]

// Convert array to JSON string and store it
localStorage.setItem("fruits", JSON.stringify(fruits))

// Get JSON string from localStorage
const storedFruits = localStorage.getItem("fruits")

// Convert JSON string to JavaScript array
const parsedFruits = JSON.parse(storedFruits)

console.log(parsedFruits)

// Storing an object

const user = {
    name: "Mehar",
    age: 21,
    role: "developer"
};

localStorage.setItem("user", JSON.stringify(user))

const storedUser = localStorage.getItem("user")

const parsedUser = JSON.parse(storedUser)

console.log(parsedUser)

// Storing arrays of objects

const jobs = [
    {
        customer: "John",
        vehicle: "Golf",
        price: 120
    },
    {
        customer: "Sarah",
        vehicle: "Civic",
        price: 150
    }
];

localStorage.setItem("jobs", JSON.stringify(jobs))

const storedJobs = localStorage.getItem("jobs")

const parsedJobs = JSON.parse(storedJobs)

console.log(parsedJobs)