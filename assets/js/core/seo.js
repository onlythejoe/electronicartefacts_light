/**
 * EA SEO MINIMAL
 * Met à jour le titre selon pages.json
 */

import { resolveFromRoot } from "./resolver.js";

async function loadConfig() {
    const res = await fetch(resolveFromRoot("config/pages.json"));
    return res.ok ? res.json() : {};
}

export async function applySeo(page) {
    const config = await loadConfig();
    const meta = config[page];

    if (!meta) {
        document.title = "Electronic Artefacts";
        return;
    }

    document.title = `Electronic Artefacts — ${meta.title}`;
}

window.addEventListener("ea-page-loaded", () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page") || "home";
    applySeo(page);
});
