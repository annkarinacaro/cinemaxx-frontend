const backendURI = "https://cinema-backend1.herokuapp.com";
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

export default function initSeatSelector(id, onSuccess) {
  const seatSelector = document.querySelector(".seat-selector");
  viewingId = id;
  getSeats((seatInfo) => {
    while (seatSelector.children.length > 0)
      seatSelector.removeChild(seatSelector.firstChild);
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

    // Screen visual
    const screenElement = document.createElement("div");
    screenElement.classList.add("movie-screen");
    screenElement.innerHTML = "SCREEN";
    seatSelector.appendChild(screenElement);

    onSuccess();
  });
}

export function updateBookingSeats(id) {
  const seatSelector = document.querySelector(".seat-selector");
  bookingId = id;
  getBookingSeats((seatInfo) => {
    seatInfo.seats.forEach((seat) => {
      const seatElement = seatSelector
        .querySelectorAll(".row")
        [seat.row].querySelectorAll(".seat")[seat.seat];
      seatElement.classList.remove("booked");
      seatElement.classList.add("selected");
    });
  });
}

export function initBookingButton() {
  const bookingButton = document.querySelector(".book-button");
  bookingButton.addEventListener("click", makeBooking);
}

export function initUpdateButton(email, onSuccess) {
  const bookingButton = document.querySelector(".update-button");
  bookingButton.addEventListener("click", () => putBooking(email, onSuccess));
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

function putBooking(email, onSuccess) {
  const seats = getSelectedSeats();
  const body = {
    viewing: viewingId,
    email: email,
    seats: seats,
  };

  fetch(backendURI + "/booking/" + bookingId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((booking) => {
      onSuccess();
    });
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
      location.reload();
      console.log("amaze: ", booking);
    });
}
