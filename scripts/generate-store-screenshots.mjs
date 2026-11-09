import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "playwright";

const root = path.resolve("www");
const output = path.resolve("play-store-assets");
fs.mkdirSync(output, { recursive: true });

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
  let file = path.resolve(root, "." + pathname);
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

await new Promise(resolve => server.listen(4173, "127.0.0.1", resolve));

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage({
    viewport: { width: 432, height: 768 },
    deviceScaleFactor: 2
  });

  await page.addInitScript(() => {
    const data = {
      months: {
        "2026-11": {
          carry: 0,
          entries: [
            { id: "sample-debt-1", type: "debt", description: "Conta de luz", amount: 185.40, date: "2026-11-03", createdAt: 1762128000000 },
            { id: "sample-debt-2", type: "debt", description: "Internet", amount: 99.90, date: "2026-11-05", createdAt: 1762300800000 },
            { id: "sample-payment-1", type: "payment", description: "Pagamento realizado", amount: 150.00, date: "2026-11-07", createdAt: 1762473600000 }
          ]
        }
      },
      reserve: {
        monthlyGoal: 200,
        updatedAt: 1762560000000,
        deposits: [
          { id: "sample-reserve-1", amount: 80, date: "2026-11-08", createdAt: 1762560000000 }
        ]
      }
    };
    localStorage.setItem("minhaVidaFinanceira_v1", JSON.stringify(data));
  });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "screenshot-lancamentos.png") });
  await page.locator("#reserveTab").click();
  await page.screenshot({ path: path.join(output, "screenshot-reserva.png") });
} finally {
  await browser.close();
  server.close();
}
