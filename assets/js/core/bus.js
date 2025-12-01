// Minimal EA event bus. Not yet used by runtime; kept for future cohesion.
const listeners = new Map();

export function on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(cb);
}

export function off(event, cb) {
    listeners.get(event)?.delete(cb);
}

export function emit(event, data) {
    const cbs = listeners.get(event);
    if (!cbs || cbs.size === 0) return;
    cbs.forEach((cb) => {
        try {
            cb(data);
        } catch {
            // swallow to avoid breaking other listeners
        }
    });
}

// TODO Phase 4: unify window events with bus for cross-module lifecycle.
