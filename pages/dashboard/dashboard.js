export default () => {
    const content = document.querySelector(".content");
    fetch("./pages/dashboard/dashboard.html")
        .then((response) => response.text())
        .then((html) => {
            content.innerHTML = html;
        });
};