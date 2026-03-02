const GITHUB_BASE =
  "https://raw.githubusercontent.com/jackrwstevenson/agent-pattern-library/main/";
const LOCAL_BASE = "/";

const isLocalhost =
  typeof window !== "undefined" &&
  (location.hostname === "localhost" || location.hostname === "127.0.0.1");

export const BASE = isLocalhost ? LOCAL_BASE : GITHUB_BASE;

export const PATTERN_IDS = [
  "context-library",
  "authoritative-source-anchor",
  "code-archaeologist",
  "specify-plan-ship",
  "throwaway-spike",
  "skills-library",
  "deterministic-orchestration",
  "runtime-guardrails",
  "validation-constraint",
  "structural-constraint",
  "generation-memory",
  "provenance-ledger",
  "digital-twin",
  "session-checkpoint",
  "post-inference-validation",
  "context-bypass",
  "detached-agent",
  "agent-swarm",
  "autonomous-agent",
  "pyramid-summary",
  "agent-memory-graph",
  "regen",
  "golden-path-anchor",
  "spec-library",
  "garbage-collection-agent",
  "semantic-port",
];

const CATEGORY_ORDER = [
  "Grounding",
  "Workflow",
  "Safety",
  "Observability",
  "Scale",
  "Evolution",
];

export const slugify = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const parseFrontmatter = (id, text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { id };
  const result = { id };
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon > 0)
      result[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return result;
};

export const stripFrontmatter = (text) =>
  text.startsWith("---") ? text.replace(/^---\n[\s\S]*?\n---\n?/, "") : text;

export const isPattern = (patterns, id) => patterns.some((p) => p.id === id);

export const renderSidebar = (patterns, currentId, headings = []) => {
  const grouped = {};
  patterns.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const html = CATEGORY_ORDER.filter((c) => grouped[c])
    .map(
      (c) => `
      <div class="sidebar-section">
        <div class="sidebar-category">${c}</div>
        <ul>
          ${grouped[c]
            .map((p) => {
              const isActive = p.id === currentId;
              const headingsHtml =
                isActive && headings.length
                  ? `<ul class="sidebar-headings">${headings
                      .map(
                        (h) =>
                          `<li class="h${h.level}"><a href="#${slugify(h.text)}">${h.text}</a></li>`,
                      )
                      .join("")}</ul>`
                  : "";
              const badge = p.maturity
                ? `<span class="maturity ${p.maturity}">${p.maturity}</span>`
                : "";
              return `<li><a href="#${p.id}" data-pattern="${p.id}"${isActive ? ' class="active"' : ""}>${p.name}${badge}</a>${headingsHtml}</li>`;
            })
            .join("")}
        </ul>
      </div>`,
    )
    .join("");

  return html;
};

export const assignHeadingIds = (container) => {
  container.querySelectorAll("h2, h3").forEach((h) => {
    h.id = slugify(h.textContent);
  });
};

export const rewritePatternLinks = (container) => {
  container.querySelectorAll('a[href$=".md"]').forEach((a) => {
    const href = a.getAttribute("href");
    const m = href.match(/(?:patterns\/)?([^/.]+)\.md$/);
    if (m && !href.startsWith("http")) {
      a.setAttribute("href", "#" + m[1]);
      a.dataset.pattern = m[1];
    }
  });
};

export const wrapTables = (container) => {
  container.querySelectorAll("table").forEach((t) => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    t.parentNode.insertBefore(wrap, t);
    wrap.appendChild(t);
  });
};

export const rewriteThemeImages = (container) => {
  const images = container.querySelectorAll('img[src$=".png"]');
  images.forEach((img, index) => {
    const src = img.getAttribute("src").replace(/^(\.\.\/)?docs\//, "");
    const alt = img.getAttribute("alt") || "";

    img.setAttribute("src", src);
    img.classList.add("light-only");

    if (index === 0) img.setAttribute("fetchpriority", "high");

    const darkImg = document.createElement("img");
    darkImg.setAttribute("src", src.replace(/\.png$/, "-dark.png"));
    darkImg.setAttribute("alt", alt);
    darkImg.classList.add("dark-only");

    if (index === 0) darkImg.setAttribute("fetchpriority", "high");

    img.after(darkImg);
  });
};

if (typeof window !== "undefined" && document.querySelector("#theme")) {
  let patterns = [];
  const cache = {};

  const $ = (s) => document.querySelector(s);
  const scrollBehavior = () =>
    window.matchMedia("(prefers-reduced-motion:reduce)").matches
      ? "auto"
      : "smooth";

  const updateSidebar = (currentId, headings = []) => {
    $("#sidebar").innerHTML = renderSidebar(patterns, currentId, headings);
  };

  const highlightActive = () => {
    const headings = [...$("#content").querySelectorAll("h2,h3")];
    if (!headings.length) return;
    let current = headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= 100) current = h.id;
    }
    document
      .querySelectorAll(".sidebar-headings a")
      .forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + current),
      );
  };

  const render = (p) => {
    const text = cache[p]?.fullText ?? "";

    if (!text) {
      $("#content").innerHTML = "<p>Content not found</p>";
      updateSidebar(p);
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = marked.parse(
      p === "readme" ? text : stripFrontmatter(text),
    );
    rewritePatternLinks(tempDiv);
    rewriteThemeImages(tempDiv);
    wrapTables(tempDiv);
    $("#content").innerHTML = tempDiv.innerHTML;

    // Assign IDs to headings so sidebar links work
    if (p !== "readme") assignHeadingIds($("#content"));

    // Extract headings for sidebar (patterns only)
    const headings =
      p !== "readme"
        ? [...$("#content").querySelectorAll("h2,h3")].map((h) => ({
            text: h.textContent,
            level: parseInt(h.tagName[1]),
          }))
        : [];

    updateSidebar(p, headings);
  };

  const route = () => {
    const h = location.hash.slice(1) || "readme";

    if (!isPattern(patterns, h) && h !== "readme") {
      const el = document.getElementById(h);
      if (el) {
        el.scrollIntoView({ behavior: scrollBehavior() });
        return;
      }
    }

    $("#nav-home").classList.toggle("active", h === "readme");
    render(isPattern(patterns, h) ? h : "readme");
    window.scrollTo(0, 0);
  };

  $("#theme").onclick = () => {
    const isLight = document.documentElement.dataset.theme === "light";
    document.documentElement.dataset.theme = isLight ? "" : "light";
    $("#theme").textContent = isLight ? "Light" : "Dark";
    localStorage.theme = document.documentElement.dataset.theme;
  };

  if (localStorage.theme) {
    document.documentElement.dataset.theme = localStorage.theme;
    $("#theme").textContent = localStorage.theme === "light" ? "Dark" : "Light";
  }

  const closeSidebar = () => {
    $("#sidebar").classList.remove("open");
    $("#sidebar-backdrop").classList.remove("open");
  };

  $("#menu-toggle").onclick = () => {
    const open = $("#sidebar").classList.toggle("open");
    $("#sidebar-backdrop").classList.toggle("open", open);
  };

  $("#sidebar-backdrop").onclick = closeSidebar;

  $("#sidebar").onclick = (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    closeSidebar();
    if (a.dataset.pattern) {
      e.preventDefault();
      location.hash = a.dataset.pattern;
      return;
    }
    const href = a.getAttribute("href");
    if (href?.startsWith("#") && href.length > 1) {
      const el = document.getElementById(href.slice(1));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: scrollBehavior() });
        history.pushState(null, null, href);
      }
    }
  };

  $("#content").onclick = (e) => {
    if (e.target.dataset.pattern) {
      e.preventDefault();
      location.hash = e.target.dataset.pattern;
    }
  };

  window.addEventListener("scroll", highlightActive, { passive: true });
  window.onhashchange = route;

  const readmePromise = fetch(BASE + "README.md")
    .then((r) => r.text())
    .then((text) => {
      cache["readme"] = { fullText: text };
    })
    .catch(() => {
      cache["readme"] = { fullText: "" };
    });

  const patternsPromise = Promise.all(
    PATTERN_IDS.map((id) =>
      fetch(BASE + "patterns/" + id + ".md")
        .then((r) => (r.ok ? r.text() : Promise.reject()))
        .then((text) => {
          const meta = parseFrontmatter(id, text);
          cache[id] = { meta, fullText: text };
          return meta;
        })
        .catch(() => ({
          id,
          name: id,
          description: "",
          category: "Workflow",
          maturity: "trial",
        })),
    ),
  ).then((metas) => {
    patterns = metas;
  });

  Promise.all([readmePromise, patternsPromise]).then(route);
}
