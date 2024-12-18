import { Hono } from "hono";
import { produce } from "./data/produce";
import { nutrients } from "./data/nutrients";

const app = new Hono();

app.get("/ping", (c) => c.text("ok"));

app.get("/search", async (c) => {
  const query = c.req.query("q");

  if (!query || query.length === 0) {
    return c.json([]);
  }

  const results = [];

  for (const item of produce) {
    if (item.slug.includes(query) || item.name.includes(query) || item.scientificName?.includes(query)) {
      results.push(item);
    }
  }

  return c.json(results);
});

app.get("/item/:slug", async (c) => {
  const slug = c.req.param("slug");
  const item = produce.find((e) => slug === e.slug);

  if (!item) {
    return c.status(404);
  }

  return c.json({
    ...item,
    nutrients: nutrients[item.slug],
  });
});

export default app;
