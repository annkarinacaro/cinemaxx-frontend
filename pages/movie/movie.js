export default (id) => {
    const content = document.querySelector(".content");
    fetch("./pages/movie/movie.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;
            viewingId = id;
            initSeatSelector();
            setMovieInfo();
        });
};

let viewingId;
const backendURI = "https://cinema-backend1.herokuapp.com";

function changeColor() {
    if (this.classList.contains("selected")) {
        this.classList.remove("selected");
    } else if (!this.classList.contains("booked")) {
        this.classList.add("selected");
    }
}

const getSeats = (callback) => {
    fetch(backendURI + "/seats/viewing/" + viewingId)
        .then((response) => response.json())
        .then(callback);
};

const initSeatSelector = () => {
    const seatSelector = document.querySelector(".seat-selector");
    getSeats((seatInfo) => {
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
                seatElement.dataset.row = i;
                seatElement.dataset.seat = j;
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
    const seats = document.querySelector(
        ".seat-selector > .row > .seat.selected:not(.booked)"
    );
    const jsonSeats = [];
    seats.forEach((seat) => {
        const jsonSeat = { row: seat.dataset.row, seat: seat.dataset.seat };
        jsonSeats.add(jsonSeat);
    });

    return jsonSeats;
};
const setMovieInfo = () => {
    fetch(backendURI + "/viewing/" + viewingId)
        .then((response) => response.json())
        .then((viewing) => {
            let movieTitle = document.querySelector("h2.movie-title");
            let movieDescription = document.querySelector(
                "p.movie-description"
            );
            let imagePoster = document.querySelector("img.movie-poster");
            movieTitle.innerHTML = viewing.movie.title;
            movieDescription.innerHTML = viewing.movie.description;
            imagePoster.src = viewing.movie.poster;
        });
};

const makeAbooking = () => {
    const email = document.querySelector("email").innerHTML;
    const seats = getSelectedSeats();
    const body = {
        viewing: viewingId,
        email: email,
        seats: seats,
    };

    fetch(backendURI + "booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((booking) => {
            console.log("amaze: ", booking);
        });
};
