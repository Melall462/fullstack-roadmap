const usernameInput = document.getElementById("usernameInput")
const findUserForm = document.getElementById("findUserForm")
const loading = document.getElementById("loading")
const userInfo = document.getElementById("userInfo")
const userImage = document.getElementById("userImage")
const username = document.getElementById("username")
const nameText = document.getElementById("name")
const bio = document.getElementById("bio")
const followers = document.getElementById("followers")
const following = document.getElementById("following")
const publicRepos = document.getElementById("publicRepos")
const githubLink = document.getElementById("githubLink")
const repoList = document.getElementById("repoList")
const repoTitle = document.getElementById("repoTitle")

findUserForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    userImage.setAttribute("src", "")
    username.textContent = ""
    nameText.textContent = ""
    bio.textContent = ""
    followers.textContent = ""
    following.textContent = ""
    publicRepos.textContent = ""
    githubLink.setAttribute("href", "")
    githubLink.textContent = ""
    repoList.textContent = ""

    if (usernameInput.value !== "") {
        try {
            loading.textContent = "Loading..."
            const user = await getUser(usernameInput.value)
            loading.textContent = ""

            renderUser(user)

            const userRepos = await getUserRepos(usernameInput.value)
            
            renderUserRepos(userRepos)

        } catch (error) {
            console.error(error)
            loading.textContent = "Error: User not found"
        }
    } else {
        loading.textContent = "Please enter a username"
    }
})

const getUser = async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    const user = await response.json()

    return user
}

const getUserRepos = async (username) =>{
    const response = await fetch(`https://api.github.com/users/${username}/repos`)

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    const userRepos = await response.json()

    return userRepos
}

const renderUser = (user) => {
    userImage.setAttribute("src", user.avatar_url)
    username.textContent = user.login
    nameText.textContent = user.name
    bio.textContent = user.bio
    followers.textContent = `Follower: ${user.followers}`
    following.textContent = `Following: ${user.following}`
    publicRepos.textContent = `Public Repos: ${user.public_repos}`
    githubLink.setAttribute("href", user.html_url)
    githubLink.textContent = user.html_url
}

const renderUserRepos = (userRepos) => {
    repoList.innerHTML = ""

    userRepos.forEach((repo) => {
        const newRepo = document.createElement("li")

        const repoName = document.createElement("span")
        repoName.textContent = repo.name

        const repoDesc = document.createElement("span")
        if (!repo.description) {
            repoDesc.textContent = "There is no description"
        } else {
            repoDesc.textContent = repo.description            
        }

        const repoStars = document.createElement("span")
        repoStars.textContent = `⭐${repo.stargazers_count}`

        const repoForks = document.createElement("span")
        repoForks.textContent = `Forks: ${repo.forks}`

        const repoLanguage = document.createElement("span")
        if (!repo.language) {
            repoLanguage.textContent = "There is no language"
        } else {
            repoLanguage.textContent = repo.language
        }

        const repoLink = document.createElement("a")
        repoLink.textContent = '[View Repository]'
        repoLink.setAttribute("href", repo.html_url)
        repoLink.setAttribute("target", "_blank")

        newRepo.append(repoName, repoDesc, repoStars, repoForks, repoLanguage, repoLink)

        repoList.append(newRepo)

        newRepo.classList.add("repo")

        repoName.classList.add("repo-name")
        repoDesc.classList.add("repo-description")
        repoStars.classList.add("repo-stars")
        repoForks.classList.add("repo-forks")
        repoLanguage.classList.add("repo-language")
        repoLink.classList.add("repo-link")
    });
}