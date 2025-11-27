import { injectGlobalComponents } from "./composer-global.js";
import { composePage } from "../composer/composer.js";
import { activateMenu } from "./menu.js";
import { initScrollEngine } from "./scroll-engine.js";
import { applySeo } from "./seo.js";

function resolvePage() {
    return new URLSearchParams(window.location.search).get("page") || "home";
}

async function load() {
    const page = resolvePage();
    await injectGlobalComponents();
    await composePage(page);

    activateMenu();
    initScrollEngine();
    applySeo(page);
}

window.addEventListener("DOMContentLoaded", load);
window.addEventListener("popstate", load);
