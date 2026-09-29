// DOM Fundamentals

// Selecting elemenets

// const button = document.querySelector("button");

// Changing elements

// button.textContent = "Add to cart";

// Listening for events

// button.addEventListener("click", function () {
//     button.textContent = "Button pressed"
// })

// Creating elements

// const item = document.createElement("li");
// item.textContent = "Eggs"

// Adding them to the page

// document.querySelector("ul").append(item);

// Exercises

const button = document.getElementById("button")
const counter = document.getElementById("counter")
const input = document.getElementById("input")
const display = document.getElementById("display")
const submit = document.getElementById("submit")
const characters = document.getElementById("characters")
const password = document.querySelector("#password");
const show = document.querySelector("#show");
const item = document.getElementById("item")
const add = document.getElementById("add")
const list = document.getElementById("list")

let clicks = 0;

button.addEventListener("click", function() {
    clicks += 1
    button.textContent = "Clicked!"
    counter.textContent = `Clicks: ${clicks}`
})

submit.addEventListener("click", function() {
    display.textContent = `Hello, ${input.value}!`
})

input.addEventListener("input", function() {
    characters.textContent = `Characters: ${input.value.length}`
})

show.addEventListener("click", function() {
    console.log(password.type);

    if (password.type === "password"){
        password.type = "text"
        show.textContent = "Hide"
    } else {
        password.type = "password"
        show.textContent = "Show"
    }
})

add.addEventListener("click", function() {
    if (item.value === "") {
        return;
    }
    const newItem = document.createElement("li");
    newItem.textContent = item.value;

    const remove = document.createElement("button");
    remove.textContent = "X"

    remove.addEventListener("click", function() {
        newItem.remove()
    })

    newItem.append(remove)
    list.append(newItem)
})

