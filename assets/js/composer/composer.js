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

// TODO Phase 4: add transition manager for section open/close.
function createSectionController(container, page) {
    const scrollContainer = document.querySelector(SELECTORS.pageContent);
    const sections = [...container.querySelectorAll(SELECTORS.section)].map((section) => ({
        node: section,
        id: section.dataset.section,
        preview: section.querySelector(SELECTORS.preview),
        detail: section.querySelector(SELECTORS.detail)
    }));

    const applySectionState = (targetSectionId = null) => {
        const hasTarget = targetSectionId && sections.some((s) => s.id === targetSectionId);
        const inDetail = Boolean(targetSectionId && hasTarget);

        sections.forEach(({ node, id, preview, detail }) => {
            const isTarget = inDetail && id === targetSectionId;
            const shouldOpen = !inDetail || isTarget;

            node.classList.toggle(CLASSES.sectionOpen, shouldOpen);
            node.classList.toggle(CLASSES.sectionHidden, inDetail && !isTarget);

            if (preview) preview.hidden = inDetail && isTarget;
            if (detail) detail.hidden = !(inDetail && isTarget);
        });

        document.body.classList.toggle(CLASSES.modeDetail, inDetail);
        scrollContainer?.classList.toggle(CLASSES.contentDetail, inDetail);

        if (inDetail) {
            const target = sections.find((s) => s.id === targetSectionId);
            target?.node.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
    };

    const resolveTarget = (btn) => btn.dataset.sectionTarget || btn.closest(SELECTORS.section)?.dataset.section;

    const handleOpen = (target) => {
        if (!target) return;
        updateUrl(page, target);
        applySectionState(target);
    };

    const handleBack = () => {
        updateUrl(page, null);
        applySectionState(null);
    };

    container.querySelectorAll(SELECTORS.openTrigger).forEach((btn) => {
        btn.addEventListener("click", () => handleOpen(resolveTarget(btn)));
    });

    container.querySelectorAll(SELECTORS.backTrigger).forEach((btn) => {
        btn.addEventListener("click", handleBack);
    });

    return { applySectionState };
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

    const controller = createSectionController(container, page);
    controller.applySectionState(detailSection);

    // Page composition complete; caller is responsible for dispatching lifecycle events.
}
