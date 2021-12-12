//
// ANA
//

import initSeatSelector, {
  initUpdateButton,
  updateBookingSeats,
} from "../../scripts/booking.js";

export default () => {
  const content = document.querySelector(".content");
  fetch("./pages/edit/edit.html")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html;
      initFindBookingButton();
    });

  const backendURI = "https://cinema-backend1.herokuapp.com";
  let email;

  const initFindBookingButton = () => {
    const bookingButton = document.querySelector(".find-booking-button");
    bookingButton.addEventListener("click", findBookings);
  };

  const findBookings = () => {
    email = document.querySelector(".email").value;
    fetch(backendURI + "/bookings?email=" + email)
      .then((response) => response.json())
      .then((bookings) => {
        const tableElement = document.querySelector("table.bookings-table");
        tableElement.innerHTML = `
                <tr>
                    <th>Movie</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Modify Seats</th>
                    <th>Delete</th>
                </tr>`;

        bookings.forEach((booking) => {
          const date = new Date(booking.viewing.dateTime);

          const trElement = document.createElement("tr");
          trElement.dataset.bookingId = booking.bookingId;
          tableElement.appendChild(trElement);

          const movieTdElement = document.createElement("td");
          movieTdElement.innerHTML = booking.viewing.movie.title;
          trElement.appendChild(movieTdElement);

          const dateTdElement = document.createElement("td");
          dateTdElement.innerHTML = date.toISOString().split("T")[0];
          trElement.appendChild(dateTdElement);

          const timeTdElement = document.createElement("td");
          timeTdElement.innerHTML =
            date.getHours() + ":" + leadingZeroes(date.getMinutes(), 2);
          trElement.appendChild(timeTdElement);

          const seatsTdElement = document.createElement("td");
          trElement.appendChild(seatsTdElement);

          const seatsButtonElement = document.createElement("button");
          seatsButtonElement.innerHTML = "edit";
          seatsButtonElement.classList.add("cta");
          seatsButtonElement.addEventListener("click", () => {
            initSeatSelector(booking.viewing.viewingId, () =>
              updateBookingSeats(booking.bookingId)
            );
            const overlay = document.querySelector(".overlay");
            initUpdateButton(email, () => overlay.classList.add("hidden"));
            overlay.classList.remove("hidden");
          });
          seatsTdElement.appendChild(seatsButtonElement);

          const deleteSeatsTdElement = document.createElement("td");
          trElement.appendChild(deleteSeatsTdElement);

          const deleteButtonElement = document.createElement("button");
          deleteButtonElement.innerHTML = "delete";
          deleteButtonElement.classList.add("cta");
          deleteButtonElement.addEventListener("click", () => {
            fetch(
              backendURI + "/booking/" + booking.bookingId + "?email=" + email,
              { method: "DELETE" }
            )
              .then((response) => response.text())
              .then(() => {
                tableElement.removeChild(trElement);
              });
          });
          deleteSeatsTdElement.appendChild(deleteButtonElement);
        });
      });
  };
};

function leadingZeroes(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
