import { describe, expect, it } from "vitest";
import { getVisiblePosts } from "../src/lib/posts";

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
});
