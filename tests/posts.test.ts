import { describe, expect, it } from "vitest";
import { getAllTags, getPostsByTag, getVisiblePosts } from "../src/lib/posts";

describe("getVisiblePosts", () => {
  it("filters drafts and sorts newest first", () => {
    const posts = [
      { data: { draft: false, pubDate: new Date("2026-01-10") } },
      { data: { draft: true, pubDate: new Date("2026-03-01") } },
      { data: { draft: false, pubDate: new Date("2026-02-15") } },
    ];

    expect(getVisiblePosts(posts)).toEqual([
      { data: { draft: false, pubDate: new Date("2026-02-15") } },
      { data: { draft: false, pubDate: new Date("2026-01-10") } },
    ]);
  });

  it("includes drafts when explicitly enabled", () => {
    const posts = [
      { data: { draft: false, pubDate: new Date("2026-01-10") } },
      { data: { draft: true, pubDate: new Date("2026-03-01") } },
      { data: { draft: false, pubDate: new Date("2026-02-15") } },
    ];

    expect(getVisiblePosts(posts, { includeDrafts: true })).toEqual([
      { data: { draft: true, pubDate: new Date("2026-03-01") } },
      { data: { draft: false, pubDate: new Date("2026-02-15") } },
      { data: { draft: false, pubDate: new Date("2026-01-10") } },
    ]);
  });

  it("hides debug posts unless explicitly enabled", () => {
    const posts = [
      { data: { debugOnly: true, draft: false, pubDate: new Date("2026-04-04") } },
      { data: { draft: false, pubDate: new Date("2026-04-03") } },
    ];

    expect(getVisiblePosts(posts)).toEqual([
      { data: { draft: false, pubDate: new Date("2026-04-03") } },
    ]);

    expect(getVisiblePosts(posts, { includeDebug: true })).toEqual([
      { data: { debugOnly: true, draft: false, pubDate: new Date("2026-04-04") } },
      { data: { draft: false, pubDate: new Date("2026-04-03") } },
    ]);
  });

  it("collects unique tags into stable slugs", () => {
    const posts = [
      { data: { draft: false, pubDate: new Date("2026-01-10"), tags: ["Physics", "Investing"] } },
      { data: { draft: false, pubDate: new Date("2026-02-15"), tags: ["quantum mechanics", "physics"] } },
    ];

    expect(getAllTags(posts)).toEqual([
      { label: "investing", slug: "investing" },
      { label: "physics", slug: "physics" },
      { label: "quantum mechanics", slug: "quantum-mechanics" },
    ]);
  });

  it("filters posts by a tag slug", () => {
    const olderPost = {
      data: { draft: false, pubDate: new Date("2026-01-10"), tags: ["physics"] },
    };
    const newerPost = {
      data: { draft: false, pubDate: new Date("2026-02-15"), tags: ["quantum mechanics"] },
    };
    const posts = [olderPost, newerPost];

    expect(getPostsByTag(posts, "physics")).toEqual([olderPost]);
    expect(getPostsByTag(posts, "quantum-mechanics")).toEqual([newerPost]);
  });
});
