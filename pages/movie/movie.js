export default (id) => {
    const content = document.querySelector(".content");
    fetch("./pages/movie/movie.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;

            //id;
        });
};