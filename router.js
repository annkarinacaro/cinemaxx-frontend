import renderMain from "./pages/main/main.js";
import renderAbout from "./pages/about-us/about-us.js";
import renderMovie from "./pages/movie/movie.js";

let root = "/"
if(location.hostname.includes("github"))
    rott = "/cinemaxx-frontend/";
    
const router = new Navigo(root, { hash: true });
router
  .on({
  	"/": () => {
      renderMain();
    },
    "/about/": () => {
      renderAbout();
    },
    "/movie/:id/": ({data}) => {
      renderMovie(data.id);
    }
	}).resolve();
