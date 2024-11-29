import { Hono } from "hono";
import { produce } from "./data/produce";
import { nutrients } from "./data/nutrients";
// import { data } from "./data";
// import { id } from "./utils/id";
// import { produce, nutrients } from "./db";
// import { or, like, eq } from "drizzle-orm";
// import { drizzle } from "drizzle-orm/d1";

const app = new Hono<{ Bindings: Env }>();

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
