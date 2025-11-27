/**
 * EA MENU — activation du lien courant
 */

function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
}

export function activateMenu() {
    const current = getCurrentPage();
    const links = document.querySelectorAll(".ea-menu-link");

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

window.addEventListener("ea-page-loaded", activateMenu);
