export const BASE =
  "https://raw.githubusercontent.com/jackrwstevenson/agent-pattern-library/main/";

export const slugify = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const parsePatterns = (md) => {
  const result = [];
  const lines = md.split("\n");
  for (const line of lines) {
    const match = line.match(
      /\|\s*\[([^\]]+)\]\(patterns\/([^.]+)\.md\)\s*\|\s*([^|]+)\|/,
    );
    if (match) result.push([match[2], match[1], match[3].trim()]);
  }
  return result;
};

export const isPattern = (patterns, id) => patterns.some((p) => p[0] === id);

export const renderPatternsList = (patterns) =>
  '<h1>Patterns</h1><ul class="patterns">' +
  patterns
    .map(
      ([id, name, desc]) =>
        `<li><a href="#${id}" data-pattern="${id}">${name}</a><small>${desc}</small></li>`,
    )
    .join("") +
  "</ul>";

export const buildTocHtml = (headings) => {
  if (headings.length < 2) return "";
  let html = "<h4>On this page</h4><ul>";
  for (const h of headings) {
    const id = slugify(h.textContent);
    html += `<li><a href="#${id}" class="${h.tagName.toLowerCase()}">${h.textContent}</a></li>`;
  }
  return html + "</ul>";
};

export const rewritePatternLinks = (container) => {
  container.querySelectorAll('a[href^="patterns/"]').forEach((a) => {
    const m = a.getAttribute("href").match(/patterns\/([^.]+)\.md/);
    if (m) a.setAttribute("href", "#" + m[1]);
  });
};

// App initialisation - only runs in browser with DOM ready
if (typeof window !== "undefined" && document.querySelector("#theme")) {
  let patterns = [];

  const $ = (s) => document.querySelector(s);
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const scrollBehavior = () => (prefersReducedMotion() ? "auto" : "smooth");

  const buildToc = () => {
    const headings = $("#content").querySelectorAll("h2,h3,h4");
    const html = buildTocHtml([...headings]);
    headings.forEach((h) => (h.id = slugify(h.textContent)));
    $("#toc").innerHTML = html;
  };

  const highlightToc = () => {
    const headings = [...$("#content").querySelectorAll("h2,h3,h4")];
    if (!headings.length) return;
    let current = headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top <= 100) current = h.id;
    }
    $("#toc").querySelectorAll("a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  };

  const render = (p) => {
    if (p === "patterns") {
      $("#content").innerHTML = renderPatternsList(patterns);
      $("#toc").innerHTML = "";
      return;
    }
    const url = p === "readme" ? BASE + "README.md" : BASE + "patterns/" + p + ".md";
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((text) => {
        if (p === "readme" && !patterns.length) patterns = parsePatterns(text);
        $("#content").innerHTML = marked.parse(text);
        rewritePatternLinks($("#content"));
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
    document.querySelectorAll("nav a").forEach((a) => {
      a.classList.toggle(
        "active",
        a.dataset.page === h || (a.dataset.page === "patterns" && patternMatch),
      );
    });
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
