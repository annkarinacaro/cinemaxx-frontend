import renderMain from "./pages/main/main.js";
// import renderAbout from "./pages/about/about.js";

const router = new Navigo("/", { hash: true });
router
  .on({
  	"/cinemaxx-frontend/": () => {
      renderMain();
    },
    // "about": () => {
    //   renderAbout();
    // }
	}).resolve();
