import { test, expect, type Page } from "@playwright/test";

async function mockSession(page: Page) {
  let refreshes = 0,
    expired = false,
    revoked = false;
  const headers: { path: string; authorization: string | undefined }[] = [];
  await page.route("**/api/**", async (route) => {
    const req = route.request(),
      path = new URL(req.url()).pathname;
    const authorization = req.headers().authorization;
    headers.push({ path, authorization });
    if (path === "/api/users/refresh") {
      if (revoked)
        return route.fulfill({
          status: 401,
          json: { code: "SESSION_EXPIRED" },
        });
      refreshes++;
      expired = false;
      return route.fulfill({
        json: { accessToken: `memory-access-${refreshes}` },
      });
    }
    if (
      ["/api/users/forgot-password", "/api/users/reset-password"].includes(path)
    )
      return route.fulfill({ json: { success: true } });
    if (expired || authorization !== `Bearer memory-access-${refreshes}`)
      return route.fulfill({ status: 401, json: { code: "SESSION_EXPIRED" } });
    if (path === "/api/users/me")
      return route.fulfill({
        json: { user: { id: 1, name: "Ana", email: "ana@example.test" } },
      });
    if (path === "/api/users/logout") {
      revoked = true;
      return route.fulfill({ json: { success: true } });
    }
    if (path === "/api/users/preferences")
      return route.fulfill({
        json: { onboardingAt: "2026-10-01", reminderDays: 3 },
      });
    if (path === "/api/users/sessions") return route.fulfill({ json: [] });
    if (path === "/api/users/support")
      return route.fulfill({ json: { email: null } });
    if (path === "/api/finance/reminders")
      return route.fulfill({
        json: { today: "2026-10-21", reminderDays: 3, entries: [] },
      });
    if (path === "/api/finance/overview")
      return route.fulfill({
        json: {
          period: "2026-10",
          categories: [],
          transactions: [],
          summary: {
            income: 0,
            expenses: 0,
            plannedIncome: 0,
            plannedExpenses: 0,
            result: 0,
            projectedResult: 0,
          },
        },
      });
    return route.fulfill({ json: [] });
  });
  return {
    headers,
    refreshes: () => refreshes,
    expire: () => {
      expired = true;
    },
  };
}
async function expectNoStoredCredentials(page: Page) {
  expect(
    await page.evaluate(() => ({
      access: sessionStorage.getItem("finsy_acessToken"),
      refresh: localStorage.getItem("finsy_refreshToken"),
    })),
  ).toEqual({ access: null, refresh: null });
}

test("access token exists only in React memory; Next navigation retains it and reload restores via cookie", async ({
  page,
  request,
}) => {
  const session = await mockSession(page);
  await page.goto("/home");
  await expect(
    page.getByRole("heading", { name: "Seu dinheiro, com clareza." }),
  ).toBeVisible();
  const initial = session.refreshes();
  expect(initial).toBe(1);
  await expectNoStoredCredentials(page);
  await page.locator('a[href="/transactions"]:visible').first().click();
  await expect(
    page.getByRole("heading", { name: "Cada movimento conta." }),
  ).toBeVisible();
  expect(session.refreshes()).toBe(initial);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Cada movimento conta." }),
  ).toBeVisible();
  expect(session.refreshes()).toBe(initial + 1);
  await expectNoStoredCredentials(page);
  const serverHtml = await (await request.get("/home")).text();
  expect(serverHtml).not.toContain("memory-access-");
  expect(
    session.headers.some(
      (h) =>
        h.path === "/api/users/me" &&
        h.authorization === "Bearer memory-access-2",
    ),
  ).toBe(true);
});

test("expired requests share one refresh and retry with the new in-memory token", async ({
  page,
}) => {
  const session = await mockSession(page);
  await page.goto("/home");
  await expect(
    page.getByRole("heading", { name: "Seu dinheiro, com clareza." }),
  ).toBeVisible();
  session.expire();
  await page.locator('a[href="/settings"]:visible').first().click();
  await expect(
    page.getByRole("heading", { name: "Configurações", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Antecedência dos lembretes")).toBeVisible();
  expect(session.refreshes()).toBe(2);
  await expectNoStoredCredentials(page);
});

test("logout revokes the session, clears memory and public requests carry no access token", async ({
  page,
}) => {
  const session = await mockSession(page);
  await page.goto("/settings");
  await expect(
    page.getByRole("heading", { name: "Configurações", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Sair da conta", exact: true })
    .last()
    .click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Seu espaço te espera." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Esqueci minha senha" }).click();
  await page.getByLabel("E-mail", { exact: true }).fill("ana@example.test");
  await page
    .getByRole("button", { name: "Enviar link de recuperação" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Se este e-mail estiver cadastrado",
  );
  expect(
    session.headers.find((h) => h.path === "/api/users/forgot-password")
      ?.authorization,
  ).toBeUndefined();
  await expectNoStoredCredentials(page);
});
