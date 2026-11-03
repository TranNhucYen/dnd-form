import type { Locator, Page } from "@playwright/test";

export async function dragPaletteItemToCanvas(
  page: Page,
  paletteItem: Locator,
  x = 220,
  y = 180,
) {
  const source = await paletteItem.boundingBox();
  const canvas = await page.locator('[data-droppable-id="canvas"]').boundingBox();

  if (!source || !canvas) {
    throw new Error("Could not find the palette item or form canvas.");
  }

  await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
  await page.mouse.down();
  // @dnd-kit configures a 200 ms pointer activation delay for mouse drags.
  await page.waitForTimeout(250);
  await page.mouse.move(canvas.x + x, canvas.y + y, { steps: 12 });
  await page.mouse.up();
}
