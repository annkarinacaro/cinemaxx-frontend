export default () => {
    const content = document.querySelector(".content");
    fetch("./pages/edit/edit.html")
        .then((response) => response.text())
        .then((html) => {
        content.innerHTML = html;
    });
};