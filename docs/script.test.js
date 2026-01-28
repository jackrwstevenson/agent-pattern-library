import { describe, it, expect, beforeEach } from "vitest";
import {
  BASE,
  slugify,
  parsePatterns,
  isPattern,
  renderPatternsList,
  buildTocHtml,
  rewritePatternLinks,
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

| Pattern | Description | Novel Insight |
| ------- | ----------- | ------------- |
| [Throwaway Spike](patterns/throwaway-spike.md) | Rapid prototypes with constraints. | Adds guardrails. |
| [Context Library](patterns/context-library.md) | Reference material for agents. | Institutional memory. |
| [Spec Library](patterns/spec-library.md) | Specs as the library. | Inverts distribution. |

## Other stuff
`;

  it("extracts patterns from README table", () => {
    const patterns = parsePatterns(sampleReadme);
    expect(patterns).toHaveLength(3);
  });

  it("extracts pattern id, name, and description", () => {
    const patterns = parsePatterns(sampleReadme);
    expect(patterns[0][0]).toBe("throwaway-spike");
    expect(patterns[0][1]).toBe("Throwaway Spike");
    expect(patterns[0][2]).toBe("Rapid prototypes with constraints.");
  });

  it("returns empty array for markdown without pattern table", () => {
    const patterns = parsePatterns("# Just a title\n\nSome text.");
    expect(patterns).toHaveLength(0);
  });

  it("ignores table header row", () => {
    const patterns = parsePatterns(sampleReadme);
    const ids = patterns.map((p) => p[0]);
    expect(ids).not.toContain("Pattern");
    expect(ids).not.toContain("-------");
  });
});

describe("isPattern", () => {
  const patterns = [
    ["throwaway-spike", "Throwaway Spike", "Desc"],
    ["context-library", "Context Library", "Desc"],
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
    ["throwaway-spike", "Throwaway Spike", "Rapid prototypes"],
    ["context-library", "Context Library", "Reference material"],
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
