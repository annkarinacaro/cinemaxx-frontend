const backendURI = "https://cinema-backend1.herokuapp.com";
const seatSelector = document.querySelector(".seat-selector");
let viewingId;
let bookingId;

function changeColor() {
    if (this.classList.contains("selected")) {
        this.classList.remove("selected");
    } else if (!this.classList.contains("booked")) {
        this.classList.add("selected");
    }
}

function getSeats(callback) {
    fetch(backendURI + "/seats/viewing/" + viewingId)
        .then((response) => response.json())
        .then(callback);
}

function getBookingSeats(callback) {
    fetch(backendURI + "/seats/booking/" + bookingId)
        .then((response) => response.json())
        .then(callback);
}

export default function initSeatSelector(id) {
    console.log(id)
    viewingId = id;
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
}


export function updateSeatsForViewing(id){
    bookingId = id;
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

}

export function initBookingButton() {
    const bookingButton = document.querySelector(".book-button");
    bookingButton.addEventListener("click", makeBooking);
}

export function initUpdateButton(){
    const bookingButton = document.querySelector(".update-button");
    bookingButton.addEventListener("click", makeBooking);
}

function getSelectedSeats() {
    const seats = document.querySelectorAll(
        ".seat-selector > .row > .seat.selected:not(.booked)"
    );
    const jsonSeats = [];
    seats.forEach((seat) => {
        const jsonSeat = { row: seat.dataset.row, seat: seat.dataset.seat };
        jsonSeats.push(jsonSeat);
    });

    return jsonSeats;
}

function makeBooking() {
    const email = document.querySelector(".email").value;
    const seats = getSelectedSeats();
    const body = {
        viewing: viewingId,
        email: email,
        seats: seats,
    };

    fetch(backendURI + "/booking", {
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
}
