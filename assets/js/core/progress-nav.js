import { SELECTORS, CLASSES, EVENTS } from "./constants.js";

let teardown = null;

function reset() {
    if (typeof teardown === "function") teardown();
    teardown = null;
    const wrapper = document.querySelector(SELECTORS.progressNav);
    if (wrapper) wrapper.innerHTML = "";
}

export function initProgressNav() {
    reset();

    const wrapper = document.querySelector(SELECTORS.progressNav);
    const content = document.querySelector(SELECTORS.pageContent);

    if (!wrapper || !content) return;

    const sections = [...content.querySelectorAll(SELECTORS.section)];
    if (sections.length === 0) return;
    const dots = sections.map((_, i) => {
        const d = document.createElement("div");
        d.className = CLASSES.progressDot;
        d.dataset.index = i;
        wrapper.appendChild(d);
        return d;
    });

    function updateDots() {
        const h = window.innerHeight;
        let active = 0;

        sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect();
            if (rect.top <= h * 0.5 && rect.bottom >= h * 0.5) active = i;
        });

        dots.forEach((d, i) =>
            d.classList.toggle(CLASSES.progressDotActive, i === active)
        );
    }

    updateDots();
    content.addEventListener("scroll", updateDots, { passive: true });
    teardown = () => content.removeEventListener("scroll", updateDots);
}

window.addEventListener(EVENTS.pageLoaded, initProgressNav);
