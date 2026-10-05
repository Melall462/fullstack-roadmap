// Async

// setTimeout()
// Runs a fucntion x seconds after loading the page

// console.log("A")

// setTimeout(() => {
//     console.log("B")
// }, 2000)

// console.log("C")

// Promises
// Represents a value that you dont have yet

// const promise = new Promise((resolve, reject) => {

//     setTimeout(() => {
//         reject("Something went wrong!")
//     }, 2000)
// })

// .then()
// Tell what a promise to do when it succeeds

// promise.then((result) => {
//     console.log(result)
// })

// .catch()
// Cathces if something goes wrong

// promise
//     .then((result) => {
//         console.log(result)
//     })
//     .catch((error) => {
//         console.log(error)
//     })

// .fetch()
// 

// fetch("https://jsonplaceholder.typicode.com/users")
//     .then((response) => {
//         return response.json()
//     })
//     .then((data) => {
//         console.log(data)
//     })
//     .catch((error) => {
//         console.log(error)
//     })

// response.json()
// Converts the received data into JavaScript values and returns a promise

// async/await
// Instead of the previous method we can use async functions

// async function getUsers() {
//     const response = await fetch("https://jsonplaceholder.typicode.com/users")

//     const data = await response.json()

//     console.log(data)
// }

// getUsers()

// Async means this function will run asynchronously and return a promise

// Await means wait for the promsie to settle, then give me the results

// try/catch
// Instead of .then() and .cathch() we use try/catch

// async function getUsers() {
//     try {
        
//         const response = await fetch("https://jsonplaceholder.typicode.com/users")

//         const data = await response.json()

//         console.log(data)

//     } catch {

//         console.log(error)
//     }
// }

// getUsers()

// HTTP errors
// fetch() doesnt generally reject 404 or 500 error status codes so we need to handle it differently

// async function getUsers() {
//     try {
        
//         const response = await fetch("https://jsonplaceholder.typicode.com/users")

//         if (!response.ok) {
//             throw new Error(`HTTP error:${response.status}`)
//         }

//         const users = await response.json()

//         const names = users.map(user => user.name)

//         console.log(users)
        
//         console.log(names)

//     } catch {

//         console.log(error)
//     }
// }

// getUsers()

// Promise.all()

// // Instead of 
// const users = fetch(...)
// const posts = fetch(...)
// const comments = fetch(...)

// // You could do
// const [usersResponse, postsResponse, commentsResponse] =
//     await Promise.all([
//         fetch(usersUrl),
//         fetch(postsUrl),
//         fetch(commentsUrl)
//     ])

// Exercises

const loadUsers = document.getElementById("loadUsers")
const userList = document.getElementById("userList")

console.log("Start")

setTimeout(() => {
    console.log("Wait 2 seconds")
    console.log("Finished")
}, 2000)

const promise = new Promise((resolve, reject) => {
    
    setTimeout(() => {
        resolve("Success!")
    }, 2000)
})

promise
    .then((result) => {
        console.log(result)
    })
    .catch((error) => {
        console.log(error)
    })

async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users")

        if (!response.ok) {
            throw new Error(`HTTP error:${response.status}`)
        }

        const users = await response.json()

        return users
    } catch (error) {
        console.log(error)
        throw error
    }
        
}

async function getNames() {
    const users = await getUsers()

    const names = users.map(user => user.name)

    return names
}

async function renderList() {
    const names = await getNames()

    userList.textContent = ""

    names.forEach(name => {
        const li = document.createElement("li")
        li.textContent = name

        userList.append(li)
    });
}

loadUsers.addEventListener("click",async () => {
    try {
        userList.textContent = "Loading..."
        await renderList()
    } catch (error) {
        userList.textContent = "Failed to load users"
        console.log(error)
    }
})