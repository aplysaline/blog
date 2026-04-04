import { defineConfig } from "astro/config";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner = "", repo = ""] = repository.split("/");
const isPagesBuild = process.env.GITHUB_ACTIONS === "true" && Boolean(owner && repo);
const isUserOrOrgPagesRepo =
  owner.length > 0 && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

export default defineConfig({
  output: "static",
  site: isPagesBuild
    ? isUserOrOrgPagesRepo
      ? `https://${repo}`
      : `https://${owner}.github.io`
    : undefined,
  base: isPagesBuild && !isUserOrOrgPagesRepo ? `/${repo}` : undefined,
  server: {
    host: true,
  },
  vite: {
    server: {
      host: true,
      allowedHosts: true,
    },
  },
});
