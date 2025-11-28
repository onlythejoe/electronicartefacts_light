export function initProgressNav() {
    const wrapper = document.querySelector("#ea-progress-nav");
    const content = document.querySelector("#ea-page-content");

    if (!wrapper || !content) return;

    wrapper.innerHTML = "";

    const sections = [...content.querySelectorAll(".ea-section")];
    const dots = sections.map((_, i) => {
        const d = document.createElement("div");
        d.className = "ea-progress-dot";
        d.dataset.index = i;
        wrapper.appendChild(d);
        return d;
    });

    function updateDots() {
        const h = window.innerHeight;
        let active = 0;

        sections.forEach((s, i) => {
            const rect = s.getBoundingClientRect();
            if (rect.top <= h * 0.5 && rect.bottom >= h * 0.5) active = i;
        });

        dots.forEach((d, i) =>
            d.classList.toggle("active", i === active)
        );
    }

    updateDots();
    content.addEventListener("scroll", updateDots, { passive: true });
}
