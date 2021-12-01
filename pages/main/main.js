export default () => {
    const content = document.querySelector(".content");
    fetch("./pages/main/main.html")
        .then((response) => response.text())
        .then((html) => {
        content.innerHTML = html;
    });
};