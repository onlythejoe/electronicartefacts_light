import { resolveFromRoot, getPartialUrl } from "../core/resolver.js";

async function loadPagesConfig() {
    const res = await fetch(resolveFromRoot("config/pages.json"));
    return res.ok ? res.json() : {};
}

async function loadSection(page, section) {
    const url = getPartialUrl(page, section);
    const res = await fetch(url);
    return res.ok ? res.text() : `<section class='ea-section ea-missing'><h2>Missing: ${section}</h2></section>`;
}

export async function composePage(page) {
    const container = document.querySelector("#ea-page-content");
    container.innerHTML = "<div class='ea-loading'>Chargement…</div>";

    const config = await loadPagesConfig();
    const meta = config[page];

    if (!meta) {
        container.innerHTML = "<section class='ea-section'><h2>Page inconnue</h2></section>";
        return;
    }

    let html = "";
    for (const s of meta.sections) html += await loadSection(page, s);
    container.innerHTML = html;

    window.dispatchEvent(new Event("ea-page-loaded"));
}
