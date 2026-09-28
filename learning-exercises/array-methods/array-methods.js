// Array Methods

const contacts = ["Mum", "Dad", "Brother", "Sister"];

const products = 
    [
        {
            name: "Chicken",
            price: 5.99,
            quantity: 1
        },
        {
            name: "Rice",
            price: 2.49,
            quantity: 2
        },
        {
            name: "Eggs",
            price: 3.99,
            quantity: 1
        },
        {
            name: "Milk",
            price: 4.99,
            quantity: 1
        }
    ];

// forEach()
// Performs an action on every item

contacts.forEach(function (contact) {
    console.log(contact)
});

// find()
// Searches the array for a specific item

const contact = contacts.find(function(contact) {
    return contact === "Dad"
})

console.log(contact)

// findIndex()
// Returns the index of the desired item

const index = contacts.findIndex(function(contact) {
    return contact === "Brother"
})

console.log(index)

// filter()
// Filters the array based on a condition

const notMumOrDad = contacts.filter(function(contact) {
    return (contact !== "Mum" && contact !== "Dad")
})

console.log(notMumOrDad)

// map()
// Creates a new array by transforming each item

const upperCaseContacts = contacts.map(function(contact) {
    return contact.toUpperCase();
})

console.log(upperCaseContacts)

// reduce()
// Combines an array into one result

const total = products.reduce(function(total, product) {
    return total + product.price * product.quantity;
}, 0);

console.log(total.toFixed(2))

// Exercises

const moreThen4 = products.find(function(product) {
    return product.price > 4
})

console.log(moreThen4)

const indexOfEggs = products.findIndex(function(product) {
    return product.name === "Eggs"
})

console.log(indexOfEggs)

const moreThen3 = products.filter(function(product) {
    return product.price > 3
})

console.log(moreThen3)

const productNames = products.map(function(product) {
    return product.name
})

console.log(productNames)

const priceIncrease = products.map(function(product) {
    return (product.price * 1.1).toFixed(2)
}) 

console.log(priceIncrease)

const totalItems = products.reduce(function(total, product) {
    return total + product.quantity
}, 0)

console.log(totalItems)