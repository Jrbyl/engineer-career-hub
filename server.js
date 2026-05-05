const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const publicDir = path.join(__dirname, "public");
const requestedPort = Number.parseInt(process.env.PORT || "3000", 10);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function isInsidePublicDir(filePath) {
  const relative = path.relative(publicDir, filePath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(body);
}

function serveFile(req, res, filePath) {
  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stat.size,
      "Cache-Control": "no-store"
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    send(res, 405, "Method not allowed", {
      "Allow": "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8"
    });
    return;
  }

  let pathname = "/";
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    send(res, 400, "Bad request", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.normalize(path.join(publicDir, pathname));
  if (!isInsidePublicDir(filePath)) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  serveFile(req, res, filePath);
});

function listen(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
    const address = server.address();
    console.log(`Engineer Career Hub running at http://localhost:${address.port}`);
  });
}

listen(Number.isFinite(requestedPort) ? requestedPort : 3000);
