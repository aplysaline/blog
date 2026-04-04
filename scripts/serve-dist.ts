const distDir = new URL("../dist/", import.meta.url);
const port = Number(Bun.env.PORT ?? 4173);

function contentType(pathname: string) {
  if (pathname.endsWith(".css")) return "text/css; charset=utf-8";
  if (pathname.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".json")) return "application/json; charset=utf-8";
  if (pathname.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "text/html; charset=utf-8";
}

function resolvePath(url: URL) {
  const pathname = decodeURIComponent(url.pathname);
  const trimmed = pathname.replace(/^\/+/, "");

  if (!trimmed) {
    return "index.html";
  }

  if (pathname.endsWith("/")) {
    return `${trimmed}index.html`;
  }

  return trimmed;
}

async function loadAsset(url: URL) {
  const directPath = resolvePath(url);
  const directFile = Bun.file(new URL(directPath, distDir));

  if (await directFile.exists()) {
    return {
      file: directFile,
      pathname: directPath,
    };
  }

  if (!directPath.endsWith(".html")) {
    const htmlFile = Bun.file(new URL(`${directPath}/index.html`, distDir));

    if (await htmlFile.exists()) {
      return {
        file: htmlFile,
        pathname: `${directPath}/index.html`,
      };
    }
  }

  return null;
}

if (!(await Bun.file(new URL("index.html", distDir)).exists())) {
  console.error("Missing dist output. Run `bun run build` first.");
  process.exit(1);
}

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const asset = await loadAsset(url);

    if (!asset) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(asset.file, {
      headers: {
        "Content-Type": contentType(asset.pathname),
      },
    });
  },
});

console.log(`Serving dist at http://localhost:${server.port}`);
