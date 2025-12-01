/**
 * EA SCROLL ENGINE — magnétisme + menu dynamique
 */
import { SELECTORS, CLASSES, EVENTS } from "./constants.js";

let teardown = null;
const MENU_THRESHOLD = 50;

export function initScrollEngine() {
    if (typeof teardown === "function") teardown();
    teardown = null;

    const container = document.querySelector(SELECTORS.pageContent);
    const menu = document.querySelector(SELECTORS.menu);

    if (!container || !menu) return;

    function updateMenuVisibility() {
        const y = container.scrollTop;
        if (y < MENU_THRESHOLD) {
            menu.classList.remove(CLASSES.menuVisible);
        } else {
            menu.classList.add(CLASSES.menuVisible);
        }
    }

    updateMenuVisibility();
    container.addEventListener("scroll", updateMenuVisibility, { passive: true });
    teardown = () => container.removeEventListener("scroll", updateMenuVisibility);
}

window.addEventListener(EVENTS.pageLoaded, initScrollEngine);
