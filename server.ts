import express from "express";
import path from "path";
<<<<<<< HEAD
import { createServer as createViteServer } from "vite";
import { hashPassword } from "./backend/auth.ts";
import { api } from "./backend/routes.ts";
import { loadStore, saveStore } from "./backend/store.ts";

async function seedDemoAccount() {
  const store = loadStore();
  if (store.users.some((user) => user.email === "demo@stride.vn")) return;
  store.users.push({
    id: "usr_demo",
    name: "Khách Demo",
    email: "demo@stride.vn",
    passwordHash: await hashPassword("stride123"),
    cart: [],
    likes: [],
    createdAt: new Date().toISOString(),
  });
  await saveStore(store);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));
  await seedDemoAccount();
  app.use("/api", api);
=======
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "Shop Quần Áo environment ready" });
  });
>>>>>>> 779ba4057c6798835009ad0d8cf86c88c17f4c50

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
<<<<<<< HEAD
    console.log(`Stride running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
=======
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
>>>>>>> 779ba4057c6798835009ad0d8cf86c88c17f4c50
