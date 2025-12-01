/**
 * EA SEO MINIMAL
 * Met à jour le titre selon pages.json
 */

import { loadPagesConfig } from "./config-cache.js";
import { EVENTS } from "./constants.js";

export async function applySeo(page) {
    const config = await loadPagesConfig();
    const meta = config[page];

    if (!meta) {
        document.title = "Electronic Artefacts";
        return;
    }

    document.title = `Electronic Artefacts — ${meta.title}`;
}

window.addEventListener(EVENTS.pageLoaded, () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page") || "home";
    applySeo(page);
});
