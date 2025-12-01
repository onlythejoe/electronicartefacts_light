import { resolveFromRoot, getPartialUrl } from "../core/resolver.js";

function updateUrl(page, sectionId) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);

    if (sectionId) {
        url.searchParams.set("section", sectionId);
    } else {
        url.searchParams.delete("section");
    }

    history.pushState({}, "", url);
}

function applySectionState(container, targetSectionId = null) {
    const sections = [...container.querySelectorAll(".ea-section")];
    const hasTarget = targetSectionId && sections.some((s) => s.dataset.section === targetSectionId);
    const inDetail = Boolean(targetSectionId && hasTarget);

    sections.forEach((section) => {
        const id = section.dataset.section;
        const isTarget = inDetail && id === targetSectionId;
        const preview = section.querySelector(".ea-preview");
        const detail = section.querySelector(".ea-detail");

        const shouldOpen = !inDetail || isTarget;
        section.classList.toggle("ea-section--open", shouldOpen);
        section.classList.toggle("ea-section--hidden", inDetail && !isTarget);

        if (preview) preview.hidden = inDetail && isTarget;
        if (detail) detail.hidden = !(inDetail && isTarget);
    });

    document.body.classList.toggle("ea-mode-detail", inDetail);
    const scrollContainer = document.querySelector("#ea-page-content");
    scrollContainer?.classList.toggle("ea-content--detail", inDetail);

    if (inDetail) {
        const target = sections.find((s) => s.dataset.section === targetSectionId);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
}

function attachSectionTriggers(container, page) {
    container.querySelectorAll("[data-section-trigger='open']").forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.sectionTarget || btn.closest(".ea-section")?.dataset.section;
            if (!target) return;
            updateUrl(page, target);
            applySectionState(container, target);
        });
    });

    container.querySelectorAll("[data-section-trigger='back']").forEach((btn) => {
        btn.addEventListener("click", () => {
            updateUrl(page, null);
            applySectionState(container, null);
        });
    });
}

async function loadPagesConfig() {
    const res = await fetch(resolveFromRoot("config/pages.json"));
    return res.ok ? res.json() : {};
}

async function loadSection(page, section) {
    const url = getPartialUrl(page, section);
    const res = await fetch(url);
    return res.ok ? res.text() : `<section class='ea-section ea-missing'><h2>Missing: ${section}</h2></section>`;
}

export async function composePage(page, detailSection = null) {
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

    attachSectionTriggers(container, page);
    applySectionState(container, detailSection);

    window.dispatchEvent(new Event("ea-page-loaded"));
}
