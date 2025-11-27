/**
 * EA SCROLL ENGINE — magnétisme + menu dynamique
 */
export function initScrollEngine() {
    const container = document.querySelector("#ea-page-content");
    const menu = document.querySelector(".ea-menu");

    if (!container || !menu) return;

    function updateMenuVisibility() {
        const y = container.scrollTop;
        if (y < 50) {
            menu.classList.remove("visible");
        } else {
            menu.classList.add("visible");
        }
    }

    updateMenuVisibility();
    container.addEventListener("scroll", updateMenuVisibility, { passive: true });
}

window.addEventListener("ea-page-loaded", initScrollEngine);
