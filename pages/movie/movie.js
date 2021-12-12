import initSeatSelector, { initBookingButton } from "../../scripts/booking.js";

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
      const movieDate = new Date(viewing.dateTime);
      console.log(viewing.dateTime);
      const movieTime =
        movieDate.getHours() +
        ":" +
        leadingZeroes(movieDate.getMinutes(), 2) +
        " " +
        movieDate.toISOString().split("T")[0];
      movieTitle.innerHTML =
        "<span class='movie-time'>" +
        movieTime +
        "</span> <br>" +
        viewing.movie.title;
      movieDescription.innerHTML =
        viewing.movie.description +
        "<br><br> Cast: " +
        viewing.movie.actors +
        "<br><br> Running time: " +
        viewing.movie.duration +
        "<br><br> Age requirement: " +
        viewing.movie.ageRequirement;
      movieRating.innerHTML = viewing.movie.rating + "/10 IMDb";
      imagePoster.src = viewing.movie.poster;
    });
};

function leadingZeroes(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
