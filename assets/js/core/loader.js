import { initProgressNav } from "./progress-nav.js";
import { injectGlobalComponents } from "./composer-global.js";
import { composePage } from "../composer/composer.js";
import { activateMenu } from "./menu.js";
import { initScrollEngine } from "./scroll-engine.js";
import { applySeo } from "./seo.js";

function resolvePage() {
    return new URLSearchParams(window.location.search).get("page") || "home";
}

function resolveSection() {
    return new URLSearchParams(window.location.search).get("section");
}

async function load() {
    const page = resolvePage();
    const detailSection = resolveSection();
    await injectGlobalComponents();
    await composePage(page, detailSection);

    initProgressNav();
    activateMenu();
    initScrollEngine();
    applySeo(page);

    window.dispatchEvent(new Event("ea-page-loaded"));
}

window.addEventListener("DOMContentLoaded", load);
window.addEventListener("popstate", load);
