/**
 * EA MENU — activation du lien courant
 */

import { EVENTS, SELECTORS } from "./constants.js";

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
