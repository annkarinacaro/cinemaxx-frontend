//import initLocations, {chooseClosestLocation} from "../main/main.js";

export default () => {
  const content = document.querySelector(".content");
  const backendURI = "https://cinema-backend1.herokuapp.com";
  const numOfDaysAhead = 30; //How many days ahead of today should be possible to book
  let locationDropdown;
  let dateDropdown1;
  let dateDropdown2;

  const initLocations = async () => {
    //Get all the locations
    fetch(backendURI + "/locations")
      .then((response) => response.json())
      .then((locations) => {
        //Reset locations
        while (locationDropdown.children.length > 0)
          locationDropdown.removeChild(locationDropdown.firstChild);
        //Add new locations
        locations.forEach((location) => {
          let locationElement = document.createElement("option");
          locationElement.classList.add("dropdown-item");
          locationElement.innerHTML = location.name;
          locationElement.dataset.district = location.district;
          locationElement.value = location.id;
          locationDropdown.appendChild(locationElement);
        });

        //Select the cinema closest to the client based on their IP address (if possible)
        chooseClosestLocation();
      });
  };

  const chooseClosestLocation = async () => {
    //Get client city
    fetch("http://www.geoplugin.net/json.gp")
      .then((response) => response.json())
      .then((geodata) => {
        Array.from(locationDropdown.children).forEach((location, index) => {
          //If user city is in the location name
          if (location.dataset.district.includes(geodata.geoplugin_city)) {
            location.selectedIndex = index;
          }
        });
      });
  };

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
    var table = document.getElementById("admin-table");

    viewingData.forEach((viewing) => {
      var row = table.insertRow(-1);

      // Insert new cells:
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);

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
      initLocations();
      initDatesFrom();
      initDatesUntil();

      //document.querySelector("button").addEventListener("click", getViewings);
      locationDropdown.addEventListener("change", getViewings);
      dateDropdown1.addEventListener("change", getViewings);
      dateDropdown2.addEventListener("change", getViewings);
    });
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const parseDate = (date) => date.toISOString().split("T")[0];

function leadingZeroes(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
