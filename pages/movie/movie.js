export default (viewingId) => {
    const content = document.querySelector(".content");
    fetch("./pages/movie/movie.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;
            initSeatSelector(viewingId);
            setMovieInfo(viewingId);
        });
};

const backendURI = "https://cinema-backend1.herokuapp.com";

function changeColor() {
    if (this.classList.contains("selected")) {
        this.classList.remove("selected");
    } else if (!this.classList.contains("booked")) {
        this.classList.add("selected");
    }
}

const getSeats = (viewingId, callback) => {
    fetch(backendURI + "/seats/viewing/" + viewingId)
        .then((response) => response.json())
        .then(callback);
};

const initSeatSelector = (viewingId) => {
    const seatSelector = document.querySelector(".seat-selector");
    getSeats(viewingId, (seatInfo) => {
        const rowLength = seatInfo.dimensions.rows;
        const seatLength = seatInfo.dimensions.seats;
        const bookedSeats = seatInfo.seats;
        for (let i = 0; i < rowLength; i++) {
            const rowElement = document.createElement("div");
            rowElement.classList.add("row");
            seatSelector.appendChild(rowElement);

            for (let j = 0; j < seatLength; j++) {
                const seatElement = document.createElement("div");
                seatElement.classList.add("seat");
                rowElement.appendChild(seatElement);

                bookedSeats.forEach((bookedSeat) => {
                    if (i === bookedSeat.row && j === bookedSeat.seat) {
                        seatElement.classList.add("booked");
                    }
                });

                seatElement.addEventListener("click", changeColor);
            }
        }
    });
};

const getSelectedSeats = () => {
    return document.querySelector(
        ".seat-selector > .row > .seat.selected:not(.booked)"
    );
};
const setMovieInfo = (viewingId) =>{
fetch(backendURI +"/viewing/"+viewingId)
.then((response) => response.json())
.then((viewing)=>{
    let movieTitle = document.querySelector("h2.movie-title");
    let movieDescription= document.querySelector("h2.movie-description");
    let imagePoster = document.querySelector("img.movie-poster");
    movieTitle.innerHTML = viewing.movie.title;
    movieDescription.innerHTML = viewing.movie.description;
    imagePoster.src = viewing.movie.poster;
    
})
};