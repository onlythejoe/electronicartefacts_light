/**
 * EA MENU — activation du lien courant
 */

import { EVENTS, SELECTORS, CLASSES } from "./constants.js";

function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
}

export function activateMenu() {
    const current = getCurrentPage();
    const links = document.querySelectorAll(SELECTORS.menuLink);

    links.forEach(link => {
        const page = link.dataset.page;
        if (page === current) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.setAttribute("aria-current", "false");
        }
    });
}

window.addEventListener(EVENTS.pageLoaded, activateMenu);

let touchHandlersBound = false;

function bindTouchPressFeedback() {
    if (touchHandlersBound) return;
    touchHandlersBound = true;

    document.addEventListener("touchstart", (e) => {
        const link = e.target.closest(SELECTORS.menuLink);
        if (!link) return;
        link.classList.add(CLASSES.menuPressed);
    });

    document.addEventListener("touchend", () => {
        document.querySelectorAll(`.${CLASSES.menuPressed}`).forEach((el) => {
            el.classList.remove(CLASSES.menuPressed);
        });
    });
}

bindTouchPressFeedback();
