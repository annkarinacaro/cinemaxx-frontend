export default () => {
    const content = document.querySelector(".content");
    fetch("./pages/main/main.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;
        }); 
};

const backendURI = "https://cinema-backend1.herokuapp.com";
const locationDropdown = document.querySelector(".location-dropdown");

const initLocations = () => {
    fetch(backendURI + "/locations")
    .then(response => response.json())
    .then(locations => {
        //Reset locations
        while(locationDropdown.children.length > 0) locationDropdown.removeChild(locationDropdown.firstChild);
        //Add new locations
        locations.forEach(location => {
            const locationElement = document.createElement("a");
            locationElement.classList.add("dropdown-item");
            locationElement.href = "#";
            locationElement.innerText = location.name;
            locationElement.value = location.id;
        });
    });
}

initLocations();

const getClientLocation = () => {
    fetch("http://www.geoplugin.net/json.gp")
        .then((response) => response.json())
        .then((geodata) => {
            
            console.log(geodata.geoplugin_city);
        });
};

<<<<<<< HEAD
=======
const getViewings = () => {

    fetch(backendURI + "/viewings/location/4?date=2021-10-25")
    .then(response => response.json())
    .then((viewings) => {

    });
}
>>>>>>> fa67508558481e8e987b0f08c81f3d49c60acb8c
