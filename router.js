import renderMain from "./pages/main/main.js";
import renderAbout from "./pages/about-us/about-us.js";
import renderMovie from "./pages/movie/movie.js";
import renderDashboard from "./pages/dashboard/dashboard.js";


let root = "/";
if(location.hostname.includes("github"))
    root = "/cinemaxx-frontend/";
    
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
    },
    "/dashboard/": () =>{
      renderDashboard();
    }
	}).resolve();
