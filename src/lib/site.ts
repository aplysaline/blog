export const SITE_NAME = "aplysaline";
export const DEFAULT_SITE_DESCRIPTION = "A small, static Astro blog.";

function getBasePath() {
  return import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
}

export function withBasePath(path = "") {
  return `${getBasePath()}${path.replace(/^\/+/, "")}`;
}
