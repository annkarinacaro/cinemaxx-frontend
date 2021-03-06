//
// AISTE
//

import { initLocations } from "../main/main.js";

export default () => {
  const content = document.querySelector(".content");
  const backendURI = "https://cinema-backend1.herokuapp.com";
  const numOfDaysAhead = 30; //How many days ahead of today should be possible to book
  let locationDropdown;
  let dateDropdown1;
  let dateDropdown2;

  const initDatesFrom = () => {
    //Reset dates
    while (dateDropdown1.children.length > 0)
      dateDropdown1.removeChild(dateDropdown1.firstChild);
    //Add new dates
    for (let i = 0; i < numOfDaysAhead; i++) {
      const date = new Date().addDays(i);
      let dateTitle = parseDate(date);
      if (parseDate(date) === parseDate(new Date())) {
        dateTitle = "Today";
      } else if (parseDate(date) == parseDate(new Date().addDays(1))) {
        dateTitle = "Tomorrow";
      }

      let dateElement1 = document.createElement("option");
      dateElement1.classList.add("dropdown-item");
      dateElement1.innerHTML = dateTitle;
      dateElement1.value = parseDate(date);
      dateDropdown1.appendChild(dateElement1);
    }
  };

  const initDatesUntil = () => {
    //Reset dates
    while (dateDropdown2.children.length > 0)
      dateDropdown2.removeChild(dateDropdown2.firstChild);
    //Add new dates
    for (let i = 0; i < numOfDaysAhead; i++) {
      const date = new Date().addDays(i);
      let dateTitle = parseDate(date);
      if (parseDate(date) === parseDate(new Date())) {
        dateTitle = "Today";
      } else if (parseDate(date) == parseDate(new Date().addDays(1))) {
        dateTitle = "Tomorrow";
      }
      let dateElement2 = document.createElement("option");
      dateElement2.classList.add("dropdown-item");
      dateElement2.innerHTML = dateTitle;
      dateElement2.value = parseDate(date);
      dateDropdown2.appendChild(dateElement2);
    }
  };

  const getViewings = () => {
    const selectedLocationId = locationDropdown.value;
    const selectedDate1 = dateDropdown1.value;
    const selectedDate2 = dateDropdown2.value;
    const viewingsUrl =
      backendURI +
      "/viewings/location/" +
      selectedLocationId +
      "?start_date=" +
      selectedDate1 +
      "&end_date=" +
      selectedDate2;

    fetch(viewingsUrl)
      .then((response) => response.json())
      .then((viewings) => {
        console.log(viewings);
        createTable(viewings);
      });
  };

  function createTable(viewingData) {
    let table = document.querySelector(".admin-table");
    while (table.firstElementChild.children.length > 1) {
      table.firstElementChild.removeChild(table.firstElementChild.lastChild);
    }

    viewingData.forEach((viewing) => {
      let row = table.insertRow(-1);

      // Insert new cells:
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
      let cell4 = row.insertCell(3);
      let cell5 = row.insertCell(4);

      // Add text to the new cells:
      cell1.innerHTML = viewing.viewingId;
      cell2.innerHTML = viewing.movie.title;
      const time = new Date(viewing.dateTime);

      cell3.innerHTML =
        parseDate(time) +
        " " +
        (time.getHours() - 1) +
        ":" +
        leadingZeroes(time.getMinutes(), 2);

      // Create the Edit button
      const editBtn = document.createElement("button");
      editBtn.innerHTML = "EDIT";
      editBtn.classList.add("cta");
      cell4.appendChild(editBtn);

      editBtn.addEventListener("click", () => {
        const inputDate = prompt("Enter a new date", "2021-12-23 14:00");
        const body = {
          dateTime: inputDate,
        };
        fetch(backendURI + "/viewing/" + viewing.viewingId, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => response.text())
          .then((viewing) => {
            console.log(inputDate);
            console.log("edited viewing: ", viewing);
            cell3.innerHTML = inputDate;
          });
      });

      // Create the Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "DELETE";
      deleteBtn.classList.add("cta");
      cell5.appendChild(deleteBtn);

      deleteBtn.addEventListener("click", () => {
        fetch(backendURI + "/viewing/" + viewing.viewingId, {
          method: "DELETE",
        })
          .then((response) => response.text())
          .then(() => {
            table.querySelector("tbody").removeChild(row);
          });
      });
    });
  }

  fetch("./pages/dashboard/dashboard.html")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html;

      locationDropdown = document.querySelector(".location-dropdown");
      dateDropdown1 = document.querySelector(".date-dropdown1");
      dateDropdown2 = document.querySelector(".date-dropdown2");

      //import {initLocations} from 'main';
      initLocations(false);
      initDatesFrom();
      initDatesUntil();

      //document.querySelector("button").addEventListener("click", getViewings);
      locationDropdown.addEventListener("change", getViewings);
      dateDropdown1.addEventListener("change", getViewings);
      dateDropdown2.addEventListener("change", getViewings);
    });
};

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const parseDate = (date) => date.toISOString().split("T")[0];

function leadingZeroes(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
