type PostLike = {
  data: {
    debugOnly?: boolean;
    draft?: boolean;
    pubDate: Date;
  };
};

interface VisiblePostsOptions {
  includeDebug?: boolean;
}

export function getVisiblePosts<T extends PostLike>(
  posts: T[],
  options: VisiblePostsOptions = {},
) {
  const { includeDebug = false } = options;

  return posts
    .filter((post) => !post.data.draft && (includeDebug || !post.data.debugOnly))
    .sort((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}
