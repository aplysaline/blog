type PostLike = {
  data: {
    draft?: boolean;
    pubDate: Date;
  };
};

export function getVisiblePosts<T extends PostLike>(posts: T[]) {
  return posts
    .filter((post) => !post.data.draft)
    .sort((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}
