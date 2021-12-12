import initSeatSelector, {initBookingButton} from "../../scripts/booking.js"; 

export default (id) => {
    const content = document.querySelector(".content");
    fetch("./pages/movie/movie.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;
            setMovieInfo(id);
            initSeatSelector(id, initBookingButton);
        });
};

const backendURI = "https://cinema-backend1.herokuapp.com";

const setMovieInfo = (viewingId) => {
    fetch(backendURI + "/viewing/" + viewingId)
        .then((response) => response.json())
        .then((viewing) => {
            let movieTitle = document.querySelector(".movie-title");
            let movieDescription = document.querySelector(".movie-description");
            let movieRating = document.querySelector(".movie-rating");
            let imagePoster = document.querySelector("img.movie-poster");
            movieTitle.innerHTML = viewing.movie.title;
            movieDescription.innerHTML = viewing.movie.description;
            console.log(viewing);
            movieRating.innerHTML = viewing.movie.rating;
            imagePoster.src = viewing.movie.poster;
        });
};
