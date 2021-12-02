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

