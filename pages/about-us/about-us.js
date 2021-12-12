//
// AISTE
//
export default () => {
  const content = document.querySelector(".content");
  fetch("./pages/about-us/about-us.html")
    .then((response) => response.text())
    .then((html) => {
      content.innerHTML = html;
    });
};
