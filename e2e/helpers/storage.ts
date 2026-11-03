import { unlink } from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";

const STORAGE_KEY = /^\d+-[a-f0-9]{32}\.(?:jpg|png|webp|pdf)$/;

/** Remove only upload keys surfaced through this test context's E-Form preview schema. */
export async function cleanupLocalUploads(page: Page, additionalKeys: string[] = []) {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  if (driver !== "local") {
    throw new Error("Playwright upload cleanup is restricted to local storage.");
  }

  const storedKeys = await page.evaluate(() => {
    const found = new Set<string>();
    const visit = (value: unknown) => {
      if (typeof value === "string") {
        if (/^\d+-[a-f0-9]{32}\.(?:jpg|png|webp|pdf)$/.test(value)) found.add(value);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (value && typeof value === "object") {
        Object.values(value).forEach(visit);
      }
    };

    for (let index = 0; index < localStorage.length; index += 1) {
      const item = localStorage.getItem(localStorage.key(index) ?? "");
      if (!item) continue;
      try {
        visit(JSON.parse(item));
      } catch {
        // Ignore unrelated localStorage entries.
      }
    }
    return [...found];
  });

  const keys = [...new Set([...storedKeys, ...additionalKeys])];
  const root = path.resolve(process.cwd(), process.env.LOCAL_STORAGE_DIR ?? "storage/uploads");
  for (const key of keys) {
    if (!STORAGE_KEY.test(key)) continue;
    const target = path.resolve(root, key);
    if (path.dirname(target) !== root) continue;
    await unlink(target).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}
