// Shared selectors, class names, and event ids used across modules.
export const SELECTORS = {
    pageContent: "#ea-page-content",
    progressNav: "#ea-progress-nav",
    menu: ".ea-menu",
    menuLink: ".ea-menu-link",
    section: ".ea-section",
    preview: ".ea-preview",
    detail: ".ea-detail",
    openTrigger: "[data-section-trigger='open']",
    backTrigger: "[data-section-trigger='back']"
};

export const CLASSES = {
    sectionOpen: "ea-section--open",
    sectionHidden: "ea-section--hidden",
    modeDetail: "ea-mode-detail",
    contentDetail: "ea-content--detail",
    progressDot: "ea-progress-dot",
    progressDotActive: "active",
    menuVisible: "visible",
    menuPressed: "ea-pressed"
};

export const EVENTS = {
    pageLoaded: "ea-page-loaded"
};
