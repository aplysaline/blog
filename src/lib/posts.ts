type PostLike = {
  data: {
    tags?: string[];
    debugOnly?: boolean;
    draft?: boolean;
    pubDate: Date;
  };
};

interface VisiblePostsOptions {
  includeDebug?: boolean;
  includeDrafts?: boolean;
}

export function getVisiblePosts<T extends PostLike>(
  posts: T[],
  options: VisiblePostsOptions = {},
) {
  const { includeDebug = false, includeDrafts = false } = options;

  return posts
    .filter(
      (post) =>
        (includeDrafts || !post.data.draft) && (includeDebug || !post.data.debugOnly),
    )
    .sort((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}

export function getTagSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllTags<T extends PostLike>(posts: T[]) {
  return Array.from(
    new Map(
      posts.flatMap((post) =>
        (post.data.tags ?? []).map((tag) => [getTagSlug(tag), tag.trim().toLowerCase()] as const),
      ),
    ).entries(),
  )
    .map(([slug, label]) => ({ label, slug }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function getPostsByTag<T extends PostLike>(posts: T[], tagSlug: string) {
  return posts.filter((post) =>
    (post.data.tags ?? []).some((tag) => getTagSlug(tag) === tagSlug),
  );
}
