import { getPartialUrl } from "../core/resolver.js";
import { loadPagesConfig } from "../core/config-cache.js";
import { SELECTORS, CLASSES } from "../core/constants.js";

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
    const sections = [...container.querySelectorAll(SELECTORS.section)];
    const hasTarget = targetSectionId && sections.some((s) => s.dataset.section === targetSectionId);
    const inDetail = Boolean(targetSectionId && hasTarget);

    sections.forEach((section) => {
        const id = section.dataset.section;
        const isTarget = inDetail && id === targetSectionId;
        const preview = section.querySelector(SELECTORS.preview);
        const detail = section.querySelector(SELECTORS.detail);

        const shouldOpen = !inDetail || isTarget;
        section.classList.toggle(CLASSES.sectionOpen, shouldOpen);
        section.classList.toggle(CLASSES.sectionHidden, inDetail && !isTarget);

        if (preview) preview.hidden = inDetail && isTarget;
        if (detail) detail.hidden = !(inDetail && isTarget);
    });

    document.body.classList.toggle(CLASSES.modeDetail, inDetail);
    const scrollContainer = document.querySelector(SELECTORS.pageContent);
    scrollContainer?.classList.toggle(CLASSES.contentDetail, inDetail);

    if (inDetail) {
        const target = sections.find((s) => s.dataset.section === targetSectionId);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
}

function attachSectionTriggers(container, page) {
    const handleOpen = (target) => {
        if (!target) return;
        updateUrl(page, target);
        applySectionState(container, target);
    };

    const handleBack = () => {
        updateUrl(page, null);
        applySectionState(container, null);
    };

    container.querySelectorAll(SELECTORS.openTrigger).forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.sectionTarget || btn.closest(SELECTORS.section)?.dataset.section;
            handleOpen(target);
        });
    });

    container.querySelectorAll(SELECTORS.backTrigger).forEach((btn) => {
        btn.addEventListener("click", handleBack);
    });
}

async function loadSection(page, section) {
    const url = getPartialUrl(page, section);
    const res = await fetch(url);
    return res.ok ? res.text() : `<section class='ea-section ea-missing'><h2>Missing: ${section}</h2></section>`;
}

export async function composePage(page, detailSection = null) {
    const container = document.querySelector(SELECTORS.pageContent);
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

    // Page composition complete; caller is responsible for dispatching lifecycle events.
}
