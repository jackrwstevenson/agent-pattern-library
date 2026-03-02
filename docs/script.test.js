// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import {
  BASE,
  PATTERN_IDS,
  slugify,
  parseFrontmatter,
  stripFrontmatter,
  isPattern,
  renderSidebar,
  rewritePatternLinks,
  rewriteThemeImages,
  assignHeadingIds,
} from "./script.js";

describe("BASE URL", () => {
  it("ends with slash for path joining", () => {
    expect(BASE.endsWith("/")).toBe(true);
  });
});

describe("PATTERN_IDS", () => {
  it("contains all 26 pattern ids", () => {
    expect(PATTERN_IDS).toHaveLength(26);
  });

  it("ids are lowercase kebab-case", () => {
    PATTERN_IDS.forEach((id) => {
      expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    });
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

describe("parseFrontmatter", () => {
  const sample = `---
name: Context Library
description: Curate reference material for agents.
category: Grounding
maturity: adopt
---

# Context Library

Content here.`;

  it("extracts name, description, category, maturity", () => {
    const result = parseFrontmatter("context-library", sample);
    expect(result.id).toBe("context-library");
    expect(result.name).toBe("Context Library");
    expect(result.description).toBe("Curate reference material for agents.");
    expect(result.category).toBe("Grounding");
    expect(result.maturity).toBe("adopt");
  });

  it("returns just id when no frontmatter present", () => {
    const result = parseFrontmatter("context-library", "# Context Library\nContent.");
    expect(result).toEqual({ id: "context-library" });
  });

  it("handles descriptions with colons", () => {
    const text = `---\nname: Foo: Bar\n---\n`;
    const result = parseFrontmatter("foo", text);
    expect(result.name).toBe("Foo: Bar");
  });
});

describe("stripFrontmatter", () => {
  it("removes frontmatter block from text", () => {
    const text = `---\nname: Foo\n---\n# Title\n\nContent.`;
    expect(stripFrontmatter(text)).toBe("# Title\n\nContent.");
  });

  it("returns text unchanged when no frontmatter", () => {
    const text = "# Title\n\nContent.";
    expect(stripFrontmatter(text)).toBe(text);
  });

  it("handles frontmatter at start of file", () => {
    const text = `---\nname: Test\nmaturity: adopt\n---\nContent.`;
    expect(stripFrontmatter(text)).toBe("Content.");
  });
});

describe("isPattern", () => {
  const patterns = [
    { id: "throwaway-spike", name: "Throwaway Spike", category: "Workflow", maturity: "adopt" },
    { id: "context-library", name: "Context Library", category: "Grounding", maturity: "adopt" },
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

describe("renderSidebar", () => {
  const patterns = [
    { id: "context-library", name: "Context Library", category: "Grounding", maturity: "adopt" },
    { id: "throwaway-spike", name: "Throwaway Spike", category: "Workflow", maturity: "adopt" },
    { id: "agent-swarm", name: "Agent Swarm", category: "Scale", maturity: "assess" },
  ];

  it("renders categories as sections", () => {
    const html = renderSidebar(patterns, "context-library", []);
    expect(html).toContain("Grounding");
    expect(html).toContain("Workflow");
    expect(html).toContain("Scale");
  });

  it("renders pattern links with data-pattern attributes", () => {
    const html = renderSidebar(patterns, "context-library", []);
    expect(html).toContain('href="#context-library"');
    expect(html).toContain('href="#throwaway-spike"');
    expect(html).toContain('data-pattern="context-library"');
  });

  it("marks current pattern as active", () => {
    const html = renderSidebar(patterns, "context-library", []);
    expect(html).toContain('data-pattern="context-library" class="active"');
  });

  it("does not mark other patterns as active", () => {
    const html = renderSidebar(patterns, "context-library", []);
    expect(html).not.toContain('data-pattern="throwaway-spike" class="active"');
  });

  it("renders pattern names as link text", () => {
    const html = renderSidebar(patterns, "context-library", []);
    expect(html).toContain("Context Library");
    expect(html).toContain("Throwaway Spike");
  });

  it("renders headings under the current pattern when provided", () => {
    const headings = [
      { text: "How It Works", level: 2 },
      { text: "The Trade-offs", level: 2 },
    ];
    const html = renderSidebar(patterns, "context-library", headings);
    expect(html).toContain("How It Works");
    expect(html).toContain("The Trade-offs");
    expect(html).toContain('href="#how-it-works"');
    expect(html).toContain('href="#the-trade-offs"');
  });

  it("puts heading level class on li, not the anchor", () => {
    const headings = [
      { text: "How It Works", level: 2 },
      { text: "A Detail", level: 3 },
    ];
    const html = renderSidebar(patterns, "context-library", headings);
    expect(html).toContain('<li class="h2">');
    expect(html).toContain('<li class="h3">');
    expect(html).not.toContain('<a class="h2"');
    expect(html).not.toContain('<a class="h3"');
  });

  it("renders headings after the current pattern link", () => {
    const headings = [{ text: "How It Works", level: 2 }];
    const html = renderSidebar(patterns, "context-library", headings);
    const patternLinkIdx = html.indexOf('href="#context-library"');
    const headingIdx = html.indexOf("How It Works");
    expect(headingIdx).toBeGreaterThan(patternLinkIdx);
  });

  it("does not render headings under non-current patterns", () => {
    const headings = [{ text: "How It Works", level: 2 }];
    const html = renderSidebar(patterns, "throwaway-spike", headings);
    const ctxIdx = html.indexOf('href="#context-library"');
    const spikeIdx = html.indexOf('href="#throwaway-spike"');
    const headingIdx = html.indexOf("How It Works");
    expect(headingIdx).toBeGreaterThan(spikeIdx);
    expect(headingIdx).toBeGreaterThan(ctxIdx);
  });

  it("renders maturity badge inside the pattern link", () => {
    const html = renderSidebar(patterns, "context-library", []);
    expect(html).toContain('Context Library<span class="maturity adopt">adopt</span></a>');
    expect(html).toContain('Agent Swarm<span class="maturity assess">assess</span></a>');
  });

  it("omits maturity badge when maturity is absent", () => {
    const noMaturity = [{ id: "foo", name: "Foo", category: "Grounding" }];
    const html = renderSidebar(noMaturity, "foo", []);
    expect(html).not.toContain("maturity");
  });
});

describe("rewritePatternLinks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rewrites patterns/*.md links to hash links", () => {
    document.body.innerHTML = '<a href="patterns/throwaway-spike.md">link</a>';
    rewritePatternLinks(document.body);
    expect(document.querySelector("a").getAttribute("href")).toBe("#throwaway-spike");
  });

  it("leaves other links unchanged", () => {
    document.body.innerHTML = '<a href="https://example.com">link</a>';
    rewritePatternLinks(document.body);
    expect(document.querySelector("a").getAttribute("href")).toBe("https://example.com");
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

describe("assignHeadingIds", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("assigns slugified id to h2 elements", () => {
    document.body.innerHTML = "<h2>How It Works</h2>";
    assignHeadingIds(document.body);
    expect(document.querySelector("h2").id).toBe("how-it-works");
  });

  it("assigns slugified id to h3 elements", () => {
    document.body.innerHTML = "<h3>The Trade-offs</h3>";
    assignHeadingIds(document.body);
    expect(document.querySelector("h3").id).toBe("the-trade-offs");
  });

  it("does not assign id to h1 elements", () => {
    document.body.innerHTML = "<h1>Pattern Name</h1>";
    assignHeadingIds(document.body);
    expect(document.querySelector("h1").id).toBe("");
  });

  it("does not assign id to h4 elements", () => {
    document.body.innerHTML = "<h4>Minor Detail</h4>";
    assignHeadingIds(document.body);
    expect(document.querySelector("h4").id).toBe("");
  });

  it("handles multiple headings", () => {
    document.body.innerHTML = "<h2>Overview</h2><h3>Details</h3><h2>Summary</h2>";
    assignHeadingIds(document.body);
    const headings = document.querySelectorAll("h2, h3");
    expect(headings[0].id).toBe("overview");
    expect(headings[1].id).toBe("details");
    expect(headings[2].id).toBe("summary");
  });
});

describe("rewriteThemeImages", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("strips docs/ prefix and adds light-only class", () => {
    document.body.innerHTML = '<img src="../docs/assets/diagram.png" alt="Diagram">';
    rewriteThemeImages(document.body);
    const img = document.querySelector("img.light-only");
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("assets/diagram.png");
  });

  it("strips docs/ prefix on dark variant", () => {
    document.body.innerHTML = '<img src="../docs/assets/diagram.png" alt="Diagram">';
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

  it("adds fetchpriority=high to first image only", () => {
    document.body.innerHTML = `
      <img src="first.png" alt="First">
      <img src="second.png" alt="Second">
    `;
    rewriteThemeImages(document.body);
    const imgs = document.querySelectorAll("img");
    expect(imgs[0].getAttribute("fetchpriority")).toBe("high");
    expect(imgs[1].getAttribute("fetchpriority")).toBe("high");
    expect(imgs[2].getAttribute("fetchpriority")).toBeNull();
    expect(imgs[3].getAttribute("fetchpriority")).toBeNull();
  });
});
