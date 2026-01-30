import { describe, it, expect, beforeEach } from "vitest";
import {
  BASE,
  slugify,
  parsePatterns,
  isPattern,
  renderPatternsList,
  renderHomePage,
  buildTocHtml,
  rewritePatternLinks,
  rewriteThemeImages,
} from "./script.js";

describe("BASE URL", () => {
  it("ends with slash for path joining", () => {
    expect(BASE.endsWith("/")).toBe(true);
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("foo bar baz")).toBe("foo-bar-baz");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("foo   bar")).toBe("foo-bar");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  hello  ")).toBe("hello");
    expect(slugify("---hello---")).toBe("hello");
  });

  it("handles headings with special chars", () => {
    expect(slugify("When to Use")).toBe("when-to-use");
    expect(slugify("Costs & Benefits")).toBe("costs-benefits");
  });
});

describe("parsePatterns", () => {
  const sampleReadme = `
# Agent Pattern Library

## Patterns

### Workflow

| Pattern | Description | Novel Insight |
| ------- | ----------- | ------------- |
| [Throwaway Spike](patterns/throwaway-spike.md) | Rapid prototypes with constraints. | Adds guardrails. |
| [Context Library](patterns/context-library.md) | Reference material for agents. | Institutional memory. |

### Evolution

| Pattern | Description | Novel Insight |
| ------- | ----------- | ------------- |
| [Spec Library](patterns/spec-library.md) | Specs as the library. | Inverts distribution. |

## Other stuff
`;

  it("extracts patterns from README table", () => {
    const patterns = parsePatterns(sampleReadme);
    expect(patterns).toHaveLength(3);
  });

  it("extracts pattern id, name, description, and category", () => {
    const patterns = parsePatterns(sampleReadme);
    expect(patterns[0].id).toBe("throwaway-spike");
    expect(patterns[0].name).toBe("Throwaway Spike");
    expect(patterns[0].description).toBe("Rapid prototypes with constraints.");
    expect(patterns[0].category).toBe("Workflow");
  });

  it("groups patterns by category", () => {
    const patterns = parsePatterns(sampleReadme);
    expect(patterns[0].category).toBe("Workflow");
    expect(patterns[1].category).toBe("Workflow");
    expect(patterns[2].category).toBe("Evolution");
  });

  it("returns empty array for markdown without pattern table", () => {
    const patterns = parsePatterns("# Just a title\n\nSome text.");
    expect(patterns).toHaveLength(0);
  });

  it("ignores table header row", () => {
    const patterns = parsePatterns(sampleReadme);
    const ids = patterns.map((p) => p.id);
    expect(ids).not.toContain("Pattern");
    expect(ids).not.toContain("-------");
  });
});

describe("isPattern", () => {
  const patterns = [
    { id: "throwaway-spike", name: "Throwaway Spike", description: "Desc", category: "Workflow" },
    { id: "context-library", name: "Context Library", description: "Desc", category: "Grounding" },
  ];

  it("returns true for valid pattern ids", () => {
    expect(isPattern(patterns, "throwaway-spike")).toBe(true);
    expect(isPattern(patterns, "context-library")).toBe(true);
  });

  it("returns false for invalid pattern ids", () => {
    expect(isPattern(patterns, "not-a-pattern")).toBe(false);
    expect(isPattern(patterns, "")).toBe(false);
    expect(isPattern(patterns, "readme")).toBe(false);
  });
});

describe("renderPatternsList", () => {
  const patterns = [
    { id: "throwaway-spike", name: "Throwaway Spike", description: "Rapid prototypes", category: "Workflow" },
    { id: "context-library", name: "Context Library", description: "Reference material", category: "Grounding" },
  ];

  it("renders patterns as list", () => {
    const html = renderPatternsList(patterns);
    expect(html).toContain("<h1>Patterns</h1>");
    expect(html).toContain('<ul class="patterns">');
  });

  it("includes pattern data attributes and names", () => {
    const html = renderPatternsList(patterns);
    expect(html).toContain('data-pattern="throwaway-spike"');
    expect(html).toContain("Throwaway Spike");
    expect(html).toContain('data-pattern="context-library"');
    expect(html).toContain("Context Library");
  });

  it("includes descriptions", () => {
    const html = renderPatternsList(patterns);
    expect(html).toContain("Rapid prototypes");
    expect(html).toContain("Reference material");
  });
});

describe("renderHomePage", () => {
  const patterns = [
    { id: "context-library", name: "Context Library", description: "Reference material", category: "Grounding" },
    { id: "throwaway-spike", name: "Throwaway Spike", description: "Rapid prototypes", category: "Workflow" },
    { id: "agent-swarm", name: "Agent Swarm", description: "Hierarchical swarms", category: "Scale" },
  ];

  it("renders hero section", () => {
    const html = renderHomePage(patterns);
    expect(html).toContain('<div class="hero">');
    expect(html).toContain("Agent Pattern Library");
    expect(html).toContain("Emerging patterns in AI-assisted software development");
  });

  it("groups patterns by category", () => {
    const html = renderHomePage(patterns);
    expect(html).toContain("<h2>Grounding</h2>");
    expect(html).toContain("<h2>Workflow</h2>");
    expect(html).toContain("<h2>Scale</h2>");
  });

  it("renders pattern cards with correct structure", () => {
    const html = renderHomePage(patterns);
    expect(html).toContain('class="pattern-card"');
    expect(html).toContain('data-pattern="context-library"');
    expect(html).toContain("Context Library");
    expect(html).toContain("Reference material");
  });

  it("always includes image elements for all patterns", () => {
    const html = renderHomePage(patterns);
    expect(html).toContain('src="assets/thumbs/context-library.png"');
    expect(html).toContain('src="assets/thumbs/throwaway-spike.png"');
    expect(html).toContain('src="assets/thumbs/agent-swarm.png"');
  });

  it("renders title before image", () => {
    const html = renderHomePage(patterns);
    const contextLibraryTitle = html.indexOf("Context Library");
    const contextLibraryImage = html.indexOf('src="assets/thumbs/context-library.png"');
    expect(contextLibraryTitle).toBeLessThan(contextLibraryImage);
  });

  it("renders image before description", () => {
    const html = renderHomePage(patterns);
    const contextLibraryImage = html.indexOf('src="assets/thumbs/context-library.png"');
    const contextLibraryDesc = html.indexOf("Reference material");
    expect(contextLibraryImage).toBeLessThan(contextLibraryDesc);
  });
});

describe("buildTocHtml", () => {
  it("returns empty string for fewer than 2 headings", () => {
    expect(buildTocHtml([])).toBe("");
    expect(buildTocHtml([{ textContent: "One", tagName: "H2" }])).toBe("");
  });

  it("builds TOC HTML for multiple headings", () => {
    const headings = [
      { textContent: "First", tagName: "H2" },
      { textContent: "Second", tagName: "H3" },
    ];
    const html = buildTocHtml(headings);
    expect(html).toContain("<h4>On this page</h4>");
    expect(html).toContain("<ul>");
    expect(html).toContain('href="#first"');
    expect(html).toContain('href="#second"');
    expect(html).toContain('class="h2"');
    expect(html).toContain('class="h3"');
  });
});

describe("rewritePatternLinks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rewrites patterns/*.md links to hash links", () => {
    document.body.innerHTML = '<a href="patterns/throwaway-spike.md">link</a>';
    rewritePatternLinks(document.body);
    expect(document.querySelector("a").getAttribute("href")).toBe(
      "#throwaway-spike",
    );
  });

  it("leaves other links unchanged", () => {
    document.body.innerHTML = '<a href="https://example.com">link</a>';
    rewritePatternLinks(document.body);
    expect(document.querySelector("a").getAttribute("href")).toBe(
      "https://example.com",
    );
  });

  it("handles multiple pattern links", () => {
    document.body.innerHTML = `
      <a href="patterns/throwaway-spike.md">1</a>
      <a href="patterns/context-library.md">2</a>
    `;
    rewritePatternLinks(document.body);
    const links = document.querySelectorAll("a");
    expect(links[0].getAttribute("href")).toBe("#throwaway-spike");
    expect(links[1].getAttribute("href")).toBe("#context-library");
  });

  it("adds data-pattern attribute for click handler", () => {
    document.body.innerHTML = '<a href="patterns/throwaway-spike.md">link</a>';
    rewritePatternLinks(document.body);
    expect(document.querySelector("a").dataset.pattern).toBe("throwaway-spike");
  });

  it("rewrites relative .md links (related patterns)", () => {
    document.body.innerHTML = '<a href="autonomous-agent.md">link</a>';
    rewritePatternLinks(document.body);
    const a = document.querySelector("a");
    expect(a.getAttribute("href")).toBe("#autonomous-agent");
    expect(a.dataset.pattern).toBe("autonomous-agent");
  });
});

describe("rewriteThemeImages", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("strips docs/ prefix and adds light-only class", () => {
    document.body.innerHTML =
      '<img src="../docs/assets/diagram.png" alt="Diagram">';
    rewriteThemeImages(document.body);
    const img = document.querySelector("img.light-only");
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("assets/diagram.png");
  });

  it("strips docs/ prefix on dark variant", () => {
    document.body.innerHTML =
      '<img src="../docs/assets/diagram.png" alt="Diagram">';
    rewriteThemeImages(document.body);
    const darkImg = document.querySelector("img.dark-only");
    expect(darkImg).not.toBeNull();
    expect(darkImg.getAttribute("src")).toBe("assets/diagram-dark.png");
  });

  it("preserves alt text on both images", () => {
    document.body.innerHTML = '<img src="test.png" alt="Test Image">';
    rewriteThemeImages(document.body);
    const imgs = document.querySelectorAll("img");
    expect(imgs[0].getAttribute("alt")).toBe("Test Image");
    expect(imgs[1].getAttribute("alt")).toBe("Test Image");
  });

  it("inserts dark image after light image", () => {
    document.body.innerHTML = '<img src="test.png" alt="Test">';
    rewriteThemeImages(document.body);
    const imgs = document.querySelectorAll("img");
    expect(imgs[0].classList.contains("light-only")).toBe(true);
    expect(imgs[1].classList.contains("dark-only")).toBe(true);
  });

  it("ignores non-png images", () => {
    document.body.innerHTML = '<img src="photo.jpg" alt="Photo">';
    rewriteThemeImages(document.body);
    const imgs = document.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0].classList.contains("light-only")).toBe(false);
  });

  it("handles multiple png images", () => {
    document.body.innerHTML = `
      <img src="first.png" alt="First">
      <img src="second.png" alt="Second">
    `;
    rewriteThemeImages(document.body);
    const imgs = document.querySelectorAll("img");
    expect(imgs).toHaveLength(4);
  });

  it("handles paths with multiple dots", () => {
    document.body.innerHTML = '<img src="../path/file.name.png" alt="Test">';
    rewriteThemeImages(document.body);
    const darkImg = document.querySelector("img.dark-only");
    expect(darkImg.getAttribute("src")).toBe("../path/file.name-dark.png");
  });
});
