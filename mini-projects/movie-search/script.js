const searchForm = document.getElementById("searchForm")
const search = document.getElementById("search")
const moviesDisplay = document.getElementById("moviesDisplay")

import { API_KEY } from "./config.js";

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    if (search.value.trim() === "") {
        await loadTopRatedMovies()
    } else {
        await loadSearchedMovies()
    }
})

const getTopRatedMovies  = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=500`)

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
    }

    const movies = await response.json()

    return movies
}

const getSearchedMovies = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search.value)}`)

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
    }

    const movies = await response.json()

    return movies

}

const renderMovies = (movies) => {
    moviesDisplay.innerHTML = "";
    movies.forEach((movie) => {
        if (movie.poster_path) {
            const movieDisplay = document.createElement("div")
            movieDisplay.classList.add("movieDisplay")

            const poster = document.createElement("img")
            poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            poster.classList.add("poster")
            
            const title = document.createElement("p")
            title.textContent = movie.title
            title.classList.add("title")

            movieDisplay.append(poster, title)

            moviesDisplay.append(movieDisplay)
        }
    })
}

const loadTopRatedMovies = async () => {
    const movies = await getTopRatedMovies()
    renderMovies(movies.results)
}

const loadSearchedMovies = async () => {
    const movies = await getSearchedMovies()
    renderMovies(movies.results)
}

loadTopRatedMovies()