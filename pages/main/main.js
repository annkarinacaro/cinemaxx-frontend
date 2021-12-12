const content = document.querySelector(".content");
const backendURI = "https://cinema-backend1.herokuapp.com";
const numOfDaysAhead = 30; //How many days ahead of today should be possible to book
let locationDropdown;
let dateDropdown;

export function initLocations(shouldGetViewings = true) {
    locationDropdown = document.querySelector(".location-dropdown");

    //Get all the locations
    return fetch(backendURI + "/locations")
        .then(response => response.json())
        .then(locations => {
            //Reset locations
            while(locationDropdown.children.length > 0) locationDropdown.removeChild(locationDropdown.firstChild);
            //Add new locations
            locations.forEach(location => {
                let locationElement = document.createElement("option");
                locationElement.classList.add("dropdown-item");
                locationElement.innerHTML = location.name;
                locationElement.dataset.district = location.district;
                locationElement.value = location.id;
                locationDropdown.appendChild(locationElement);
            });

            //Select the cinema closest to the client based on their IP address (if possible)
            chooseClosestLocation();

            if (shouldGetViewings) {
                getViewings();
            }
        });
}

export function chooseClosestLocation(){
    //Get client city
    return fetch("http://www.geoplugin.net/json.gp")
        .then((response) => response.json())
        .then((geodata) => {
            Array.from(locationDropdown.children).forEach((location, index) => {
                //If user city is in the location name
                if(location.dataset.district.includes(geodata.geoplugin_city)){
                    location.selectedIndex = index;
                }
            });
        });        
};

export default () => {
    function initDates(){
        //Reset dates
        while(dateDropdown.children.length > 0) dateDropdown.removeChild(dateDropdown.firstChild);
        //Add new dates
        for(let i = 0; i < numOfDaysAhead; i++){

            const date = new Date().addDays(i);
            let dateTitle = parseDate(date);
            if(parseDate(date) === parseDate(new Date())){
                dateTitle = "Today";
            }
            else if (parseDate(date) == parseDate(new Date().addDays(1))){
                dateTitle = "Tomorrow";
            }

            let dateElement = document.createElement("option");
            dateElement.classList.add("dropdown-item");
            dateElement.innerHTML = dateTitle;
            dateElement.value = parseDate(date);
            dateDropdown.appendChild(dateElement);
        }
    };

    const getViewings = () => {
        const selectedLocationId = locationDropdown.value;
        const selectedDate = dateDropdown.value;
        const viewingsUrl = backendURI + "/viewings/location/" + selectedLocationId + "?date=" + selectedDate;

        fetch(viewingsUrl)
            .then(response => response.json())
            .then((viewings) => {

                const movieContainer = document.querySelector(".movies");
                while(movieContainer.children.length > 0) movieContainer.removeChild(movieContainer.firstChild);

                viewings.forEach(viewing => {
                    const movieElement = document.createElement("div");
                    movieElement.classList.add("movie");
                    movieContainer.appendChild(movieElement);

                    const posterElement = document.createElement("img");
                    posterElement.src = viewing.movie.poster;
                    posterElement.classList.add("poster");
                    movieElement.appendChild(posterElement);

                    const titleElement = document.createElement("h3");
                    titleElement.innerHTML = viewing.movie.title;
                    titleElement.classList.add("title");
                    movieElement.appendChild(titleElement);

                    const timeElement = document.createElement("h4");
                    const time = new Date(viewing.dateTime);
                    timeElement.innerHTML = time.getHours() + ":" + leadingZeroes(time.getMinutes(), 2);
                    timeElement.classList.add("time");
                    movieElement.appendChild(timeElement);

                    const durationElement = document.createElement("h4");
                    durationElement.innerHTML = viewing.movie.duration;
                    durationElement.classList.add("duration");
                    movieElement.appendChild(durationElement);

                    const buttonElement = document.createElement("cta");
                    buttonElement.addEventListener("click", () => window.location.href = "./#/movie/" + viewing.viewingId);
                    buttonElement.innerHTML = "SEE MORE";
                    buttonElement.classList.add("cta");
                    movieElement.appendChild(buttonElement);
                });
            });
    }

  fetch("./pages/main/main.html")
    .then((response) => response.text())
    .then((html) => {
        content.innerHTML = html;

        locationDropdown = document.querySelector(".location-dropdown");
        dateDropdown = document.querySelector(".date-dropdown");

        initButtons();
        initLocations();
        initDates();

        locationDropdown.addEventListener("change", getViewings);
        dateDropdown.addEventListener("change", getViewings);
    });
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const parseDate = (date) => date.toISOString().split('T')[0];

function leadingZeroes(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}