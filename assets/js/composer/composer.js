import { resolveFromRoot, getPartialUrl } from "../core/resolver.js";
import { initProgressNav } from "../core/progress-nav.js";

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

    // === Inject little arrows on each section preview (scoped to container only) ===
    const sections = container.querySelectorAll(".ea-section");

    sections.forEach(section => {

        // Resolve section ID robustly
        let sectionId =
            section.dataset.section ||
            section.getAttribute("data-section") ||
            section.id ||
            "unknown";

        console.log("[EA] Section ID resolved:", sectionId);

        // Avoid duplicates
        if (section.querySelector(".ea-section-btn")) return;

        const btn = document.createElement("button");
        btn.className = "ea-section-btn";
        btn.textContent = "↘";
        btn.style.zIndex = "2000"; // ensure visibility above container & blobs

        btn.addEventListener("click", () => {
            const url = new URL(window.location.href);
            url.searchParams.set("section", sectionId);
            window.location.href = url.toString();
        });

        section.appendChild(btn);
    });

    // === PREVIEW / DETAIL TOGGLE (scoped correctly) ===
    const params = new URLSearchParams(location.search);
    const currentSection = params.get("section");

    sections.forEach(section => {
        const id = section.dataset.section;
        const preview = section.querySelector(".ea-preview");
        const detail = section.querySelector(".ea-detail");

        if (!preview || !detail) return;

        if (id === currentSection) {
            preview.style.display = "none";
            detail.style.display = "block";
        } else {
            preview.style.display = "block";
            detail.style.display = "none";
        }
    });

    initProgressNav();
    window.dispatchEvent(new Event("ea-page-loaded"));
}
