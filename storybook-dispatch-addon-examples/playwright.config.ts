import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  reporter: "list",
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "npm run storybook -- --host 127.0.0.1 --port 6006",
      cwd: "./local-reducer",
      url: "http://127.0.0.1:6006",
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: "npm run storybook -- --host 127.0.0.1 --port 6007",
      cwd: "./redux-toolkit",
      url: "http://127.0.0.1:6007",
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
