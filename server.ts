import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./api/index";

const PORT = 3000;

// Serve assets and static bundles
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for lightning fast development previewing
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GenZcodeStudio Backend running perfectly at http://0.0.0.0:${PORT}`);
  });
}

startServer();
