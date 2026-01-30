const GITHUB_BASE =
  "https://raw.githubusercontent.com/jackrwstevenson/agent-pattern-library/main/";
const LOCAL_BASE = "/";

const isLocalhost =
  typeof window !== "undefined" &&
  (location.hostname === "localhost" || location.hostname === "127.0.0.1");

export const BASE = isLocalhost ? LOCAL_BASE : GITHUB_BASE;

export const slugify = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const parsePatterns = (md) => {
  const result = [];
  const lines = md.split("\n");
  let currentCategory = null;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      currentCategory = line.slice(4).trim();
      continue;
    }

    const match = line.match(
      /\|\s*\[([^\]]+)\]\(patterns\/([^.]+)\.md\)\s*\|\s*([^|]+)\|/,
    );
    if (match) {
      result.push({
        id: match[2],
        name: match[1],
        description: match[3].trim(),
        category: currentCategory,
      });
    }
  }
  return result;
};

export const isPattern = (patterns, id) => patterns.some((p) => p.id === id);

export const renderPatternsList = (patterns) =>
  '<h1>Patterns</h1><ul class="patterns">' +
  patterns
    .map(
      (p) =>
        `<li><a href="#${p.id}" data-pattern="${p.id}">${p.name}</a><small>${p.description}</small></li>`,
    )
    .join("") +
  "</ul>";

export const renderHomePage = (patterns) => {
  const categories = { Grounding: [], Workflow: [], Scale: [], Evolution: [] };

  patterns.forEach((p) => {
    if (categories[p.category]) categories[p.category].push(p);
  });

  let html = `
    <div class="hero">
      <h1>Agent Pattern Library</h1>
      <p class="hero-subtitle">Emerging patterns in AI-assisted software development</p>
      <p class="hero-description">An attempt to make sense of emerging patterns in AI-assisted software development, drawn from research, personal observations and experiments.</p>
    </div>
  `;

  Object.entries(categories).forEach(([category, items]) => {
    if (!items.length) return;

    html += `<section class="pattern-category"><h2>${category}</h2><div class="pattern-grid">`;

    items.forEach((p) => {
      html += `
        <a href="#${p.id}" class="pattern-card" data-pattern="${p.id}">
          <div class="pattern-card-content"><h3>${p.name}</h3></div>
          <div class="pattern-card-image">
            <img src="assets/thumbs/${p.id}.png" alt="${p.name}" class="light-only" />
            <img src="assets/thumbs/${p.id}-dark.png" alt="${p.name}" class="dark-only" />
          </div>
          <div class="pattern-card-content"><p>${p.description}</p></div>
        </a>
      `;
    });

    html += `</div></section>`;
  });

  return html;
};

export const buildTocHtml = (headings) => {
  if (headings.length < 2) return "";
  return (
    "<h4>On this page</h4><ul>" +
    headings
      .map(
        (h) =>
          `<li><a href="#${slugify(h.textContent)}" class="${h.tagName.toLowerCase()}">${h.textContent}</a></li>`,
      )
      .join("") +
    "</ul>"
  );
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

export const rewriteThemeImages = (container) => {
  container.querySelectorAll('img[src$=".png"]').forEach((img) => {
    const src = img.getAttribute("src").replace(/^(\.\.\/)?docs\//, "");
    const alt = img.getAttribute("alt") || "";

    img.setAttribute("src", src);
    img.classList.add("light-only");

    const darkImg = document.createElement("img");
    darkImg.setAttribute("src", src.replace(/\.png$/, "-dark.png"));
    darkImg.setAttribute("alt", alt);
    darkImg.classList.add("dark-only");

    img.after(darkImg);
  });
};

if (typeof window !== "undefined" && document.querySelector("#theme")) {
  let patterns = [];

  const $ = (s) => document.querySelector(s);
  const scrollBehavior = () =>
    window.matchMedia("(prefers-reduced-motion:reduce)").matches
      ? "auto"
      : "smooth";

  const buildToc = () => {
    const headings = $("#content").querySelectorAll("h2,h3,h4");
    headings.forEach((h) => (h.id = slugify(h.textContent)));
    $("#toc").innerHTML = buildTocHtml([...headings]);
  };

  const highlightToc = () => {
    const headings = [...$("#content").querySelectorAll("h2,h3,h4")];
    if (!headings.length) return;
    let current = headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= 100) current = h.id;
    }
    $("#toc")
      .querySelectorAll("a")
      .forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + current),
      );
  };

  const render = (p) => {
    if (p === "patterns") {
      $("#content").innerHTML = renderPatternsList(patterns);
      $("#toc").innerHTML = "";
      return;
    }
    if (p === "readme") {
      $("#content").innerHTML = renderHomePage(patterns);
      $("#toc").innerHTML = "";
      return;
    }
    fetch(BASE + "patterns/" + p + ".md")
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => {
        $("#content").innerHTML = marked.parse(text);
        rewritePatternLinks($("#content"));
        rewriteThemeImages($("#content"));
        buildToc();
      })
      .catch(() => {
        $("#content").innerHTML = "<p>Failed to load content</p>";
        $("#toc").innerHTML = "";
      });
  };

  const route = () => {
    const h = location.hash.slice(1) || "readme";
    const patternMatch = isPattern(patterns, h);
    if (!patternMatch && h !== "readme" && h !== "patterns") {
      const el = document.getElementById(h);
      if (el) {
        el.scrollIntoView({ behavior: scrollBehavior() });
        return;
      }
    }
    document.querySelectorAll("nav a").forEach((a) =>
      a.classList.toggle(
        "active",
        a.dataset.page === h || (a.dataset.page === "patterns" && patternMatch),
      ),
    );
    render(h);
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

  $("#content").onclick = (e) => {
    if (e.target.dataset.pattern) {
      e.preventDefault();
      location.hash = e.target.dataset.pattern;
    }
  };

  $("#toc").onclick = (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      const id = e.target.getAttribute("href").slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });
      history.pushState(null, null, "#" + id);
    }
  };

  window.addEventListener("scroll", highlightToc, { passive: true });
  window.onhashchange = route;

  fetch(BASE + "README.md")
    .then((r) => r.text())
    .then((text) => {
      patterns = parsePatterns(text);
      route();
    })
    .catch(() => route());
}