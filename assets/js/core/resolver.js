export const EA_ROOT = ".";

export function resolveFromRoot(p) {
    p = p.replace(/^\.\//, "");
    p = p.replace(/^\/+/, "");
    return EA_ROOT + "/" + p;
}

export function getComponentUrl(path) {
    return resolveFromRoot("components/" + path);
}

export function getPartialUrl(page, section) {
    return resolveFromRoot(`pages/${page}/${section}.html`);
}
