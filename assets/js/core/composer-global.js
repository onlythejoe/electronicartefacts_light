import { getComponentUrl } from "./resolver.js";

export async function injectGlobalComponents() {
    const slots = {
        "#ea-head-slot": "head.html",
        "#ea-body-start-slot": "body-start.html",
        "#ea-menu-slot": "menu.html",
        "#ea-footer-slot": "footer.html",
        "#ea-body-end-slot": "body-end.html"
    };

    for (const [slot, file] of Object.entries(slots)) {
        const el = document.querySelector(slot);
        if (!el) continue;
        const url = getComponentUrl(file);
        try {
            const res = await fetch(url);
            el.innerHTML = res.ok ? await res.text() : "";
        } catch {
            el.innerHTML = "";
        }
    }
}
