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
const pagination = document.getElementById("pagination")
const previousButton = document.getElementById("previousButton")
const nextButton = document.getElementById("nextButton")

let currentPage =   1;
let listOfRepos = [];

findUserForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    pagination.style.display = "none";

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
            const userInfo = await getInfo(usernameInput.value)
            loading.textContent = ""

            listOfRepos = userInfo.userRepos;
            currentPage = 1;

            renderUser(userInfo.user)

            renderUserRepos(userInfo.userRepos)

            if (listOfRepos.length > 4) {
                pagination.style.display = "block";
            }

        } catch (error) {
            console.error(error)
            loading.textContent = "Error: User not found"
        }
    } else {
        loading.textContent = "Please enter a username"
    }
})

const getInfo = async (username) => {
    const [userResponse, reposResponse] = await Promise.all(
        [
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos`)
        ]
    )

    if (!userResponse.ok) {
        throw new Error(`HTTP error:${userResponse.status}`)
    }

    if (!reposResponse.ok) {
        throw new Error(`HTTP error:${reposResponse.status}`)
    }

    const [user, userRepos] = await Promise.all(
        [
            userResponse.json(),
            reposResponse.json()
        ]
    )

    return {user, userRepos}
}

const renderUser = (user) => {
    userImage.setAttribute("src", user.avatar_url)
    username.textContent = user.login
    if (!user.name) {
        nameText.textContent = "Name: -"
    } else {
        nameText.textContent = `Name: ${user.name}`
    }
    if (!user.bio) {
        bio.textContent = "Bio: -"
    } else {
        bio.textContent = `Bio: ${user.bio}`
    }    followers.textContent = `Follower: ${user.followers}`
    following.textContent = `Following: ${user.following}`
    publicRepos.textContent = `Public Repos: ${user.public_repos}`
    githubLink.setAttribute("href", user.html_url)
    githubLink.textContent = user.html_url
}

previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1
        renderUserRepos(listOfRepos)
    }
})

nextButton.addEventListener("click", () => {
    const maxNumPages = Math.ceil(listOfRepos.length / 4)
    if (currentPage < maxNumPages) {
        currentPage += 1
        renderUserRepos(listOfRepos)
    }
})

const renderUserRepos = (userRepos) => {
    repoList.innerHTML = ""

    const perPage = 4;

    console.log(currentPage)

    let startIndex = (currentPage - 1) * perPage
    let endIndex = startIndex + perPage

    let pageRepos = (userRepos.slice(startIndex, endIndex))

    pageRepos.forEach((repo) => {
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