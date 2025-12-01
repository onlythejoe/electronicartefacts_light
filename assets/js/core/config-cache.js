import { resolveFromRoot } from "./resolver.js";

let cachedConfig = null;
let pendingPromise = null;

async function fetchConfig() {
    const res = await fetch(resolveFromRoot("config/pages.json"));
    return res.ok ? res.json() : {};
}

export async function loadPagesConfig() {
    if (cachedConfig) return cachedConfig;
    if (pendingPromise) return pendingPromise;

    pendingPromise = fetchConfig().then((cfg) => {
        cachedConfig = cfg;
        pendingPromise = null;
        return cachedConfig;
    }).catch(() => {
        pendingPromise = null;
        return {};
    });

    return pendingPromise;
}
