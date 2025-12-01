import { injectGlobalComponents } from "./composer-global.js";
import { composePage } from "../composer/composer.js";
import { EVENTS } from "./constants.js";
import "./progress-nav.js";
import "./scroll-engine.js";
import "./menu.js";
import "./seo.js";

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
    window.dispatchEvent(new Event(EVENTS.pageLoaded));
}

window.addEventListener("DOMContentLoaded", load);
window.addEventListener("popstate", load);
