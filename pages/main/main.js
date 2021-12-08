export default async () => {
    const content = document.querySelector(".content");
    const backendURI = "https://cinema-backend1.herokuapp.com";
    const numOfDaysAhead = 30; //How many days ahead of today should be possible to book
    let locationDropdown;
    let dateDropdown;

    const initLocations = async () => {
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
                return chooseClosestLocation();
            });
    }

    const chooseClosestLocation = async () => {
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

    const initDates = () => {
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
                console.log(viewings);
            });
    }

    fetch("./pages/main/main.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;

            locationDropdown = document.querySelector(".location-dropdown");
            dateDropdown = document.querySelector(".date-dropdown");

            await initLocations();
            initDates();

            document.querySelector("button").addEventListener("click", getViewings); 
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
