//
// JUSTAS & ANA & AISTE
//

import renderMain from "./pages/main/main.js";
import renderAbout from "./pages/about-us/about-us.js";
import renderMovie from "./pages/movie/movie.js";
import renderEdit from "./pages/edit/edit.js";
import renderDashboard from "./pages/dashboard/dashboard.js";


let root = "/";
const router = new Navigo("/", { hash: true });

router
    .on({
        "/": () => {
            renderMain();
        },
        "/about": () => {
            renderAbout();
        },
        "/movie/:id/": ({ data }) => {
            renderMovie(data.id);
        },
        "/edit": () => {
            renderEdit();
        },
        "/dashboard": () => {
            renderDashboard();
        },
    })
    .resolve();
