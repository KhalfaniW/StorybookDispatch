import { expect, test } from "@playwright/test";

function storyUrl(origin: string, path: string) {
  return `${origin}/?path=${path}&addonPanel=dispatch-trace/panel`;
}

test("local reducer story supports dispatch and timeline navigation", async ({ page }) => {
  await page.goto(
    storyUrl(
      "http://127.0.0.1:6006",
      "/story/examples-local-reducer-counterworkbench--default",
    ),
  );

  await expect(page.getByRole("button", { name: /Step 5 reset/i })).toBeVisible({
    timeout: 30000,
  });
  await expect(page.getByText('"count": 2')).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole("button", { name: /Step 1 increment/i })).toBeVisible({
    timeout: 30000,
  });
  await expect(page.getByText("5 step(s)")).toBeVisible({ timeout: 30000 });

  await page.getByRole("button", { name: "Dispatch action" }).click();

  await expect(page.getByRole("button", { name: /Step 6 increment/i })).toBeVisible();
  await expect(page.getByText('"count": 3')).toBeVisible();

  const preview = page.frameLocator("#storybook-preview-iframe");
  await expect(preview.getByRole("heading", { name: "Inventory" })).toBeVisible();
  await expect(preview.getByText('"count": 3')).toBeVisible();

  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByText('"count": 2')).toBeVisible();

  await page.getByRole("button", { name: "Forward", exact: true }).click();
  await expect(page.getByText('"count": 3')).toBeVisible();
});

test("redux toolkit story accepts seeded toolkit actions from the addon", async ({ page }) => {
  await page.goto(
    storyUrl(
      "http://127.0.0.1:6007",
      "/story/examples-redux-toolkit-reduxtoolkitworkbench--default",
    ),
  );

  await expect(page.getByRole("button", { name: /Step 6 orders\/reset/i })).toBeVisible({
    timeout: 30000,
  });
  await expect(page.getByText("6 step(s)")).toBeVisible({ timeout: 30000 });

  await page.getByRole("button", { name: /^orders\/markBusy\s+\{/ }).click();
  await page.getByRole("button", { name: "Dispatch action" }).click();

  await expect(page.getByRole("button", { name: /Step 7 orders\/markBusy/i })).toBeVisible();
  await expect(page.getByText('"status": "busy"')).toBeVisible();

  const preview = page.frameLocator("#storybook-preview-iframe");
  await expect(preview.getByRole("heading", { name: "Orders" })).toBeVisible();
  await expect(preview.getByText('"status": "busy"')).toBeVisible();
});
