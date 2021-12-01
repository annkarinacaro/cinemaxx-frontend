export default () => {
    const content = document.querySelector(".content");
    fetch("./pages/main/main.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;
        }); 
};

let getClientLocation = () => {
    fetch("http://www.geoplugin.net/json.gp")
        .then((response) => response.json())
        .then((geodata) => {
            console.log(geodata.geoplugin_city);
        });
};

let getLocation = () =>{
    fetch("http://3.209.141.167/viewings/location/4?date=2021-10-25")
    .then
}