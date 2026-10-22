import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
test.beforeEach(async ({ page }) => {
  await page.route("**/api/users/refresh", (route) =>
    route.fulfill({ status: 401, json: { code: "SESSION_EXPIRED" } }),
  );
});

test("archived categories can be restored and archived again without losing their limits", async ({
  page,
}) => {
  await setup(page);
  let active = false;
  const category = {
    id: 4,
    name: "Viagens",
    color: "#2563eb",
    spent: 0,
    budget: { amount: 120, period: "*" },
  };
  await page.route("**/api/finance/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path === "/api/finance/categories/archived")
      return route.fulfill({
        json: active
          ? []
          : [
              {
                id: category.id,
                name: category.name,
                color: category.color,
                archivedAt: "2026-10-01T12:00:00Z",
              },
            ],
      });
    if (
      path === "/api/finance/categories/4/restore" &&
      request.method() === "POST"
    ) {
      active = true;
      return route.fulfill({ json: { success: true } });
    }
    if (path === "/api/finance/categories/4" && request.method() === "DELETE") {
      active = false;
      return route.fulfill({ status: 204 });
    }
    if (path === "/api/finance/overview")
      return route.fulfill({
        json: {
          period: new URL(request.url()).searchParams.get("period"),
          categories: active ? [category] : [],
          transactions: [],
          summary: {
            income: 0,
            expenses: 0,
            result: 0,
            plannedIncome: 0,
            plannedExpenses: 0,
            projectedResult: 0,
          },
        },
      });
    return route.fallback();
  });
  await page.goto("/categories");
  await expect(
    page.getByRole("heading", { name: "Suas primeiras categorias" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Arquivadas", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Viagens", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Restaurar Viagens", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Nenhuma categoria arquivada" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /^Ativas/ }).click();
  await expect(
    page.getByRole("heading", { name: "Viagens", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Limite: R$ 120,00", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Arquivar Viagens", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("aba Arquivadas");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Arquivar categoria", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Suas primeiras categorias" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Arquivadas", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Restaurar Viagens", exact: true }),
  ).toBeVisible();
});

test("dots ring is shared by session loading, page loading and saving buttons", async ({
  page,
}, testInfo) => {
  await setup(page);
  let releaseUser!: () => void;
  let releaseOverview!: () => void;
  let releaseSave!: () => void;
  const userGate = new Promise<void>((resolve) => {
    releaseUser = resolve;
  });
  const overviewGate = new Promise<void>((resolve) => {
    releaseOverview = resolve;
  });
  const saveGate = new Promise<void>((resolve) => {
    releaseSave = resolve;
  });
  await page.route("**/api/users/me", async (route) => {
    await userGate;
    await route.fallback();
  });
  await page.route("**/api/finance/overview?*", async (route) => {
    await overviewGate;
    await route.fallback();
  });
  await page.route("**/api/finance/transactions", async (route) => {
    await saveGate;
    await route.fulfill({ status: 201, json: { success: true } });
  });
  try {
    await page.goto("/home");
    await expect(
      page.getByRole("status", { name: "Abrindo seu espaço…" }),
    ).toBeVisible();
    const ring = page.locator(".dots-ring");
    await expect(ring.locator(":scope > div > div")).toHaveCount(8);
    await expect(ring).toHaveCSS("color", "rgb(20, 71, 230)");
    releaseUser();
    await expect(
      page.getByRole("heading", { name: "Organizando sua visão…" }),
    ).toBeVisible();
    await expect(ring).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("dots-ring-loading.png"),
    });
    releaseOverview();
    await expect(
      page.getByRole("heading", { name: "Seu dinheiro, com clareza." }),
    ).toBeVisible();
    await expect(ring).toHaveCount(0);
    await page
      .getByRole("button", { name: "Nova movimentação", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("textbox", { name: "Valor" }).fill("12,50");
    await dialog.getByLabel("Descrição").fill("Teste de carregamento");
    await dialog.getByRole("button", { name: "Salvar movimentação" }).click();
    const button = dialog.getByRole("button", { name: "Salvando…" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button.locator(".dots-ring")).toBeVisible();
    await expect(button.locator(".dots-ring")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    releaseSave();
    await expect(dialog).not.toBeVisible();
  } finally {
    releaseUser();
    releaseOverview();
    releaseSave();
  }
});

test("dots ring respects reduced motion", async ({ page }) => {
  await setup(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/finance/overview?*", async (route) => {
    await gate;
    await route.fallback();
  });
  try {
    await page.goto("/home");
    await expect(
      page.getByRole("heading", { name: "Organizando sua visão…" }),
    ).toBeVisible();
    const dots = page.locator(".dots-ring > div > div");
    await expect(dots).toHaveCount(8);
    await expect
      .poll(async () =>
        dots.evaluateAll((elements) =>
          elements.every(
            (element) => getComputedStyle(element).opacity === "1",
          ),
        ),
      )
      .toBe(true);
    const stable = await dots.evaluateAll(async (elements) => {
      const snapshot = () =>
        elements.map((element) => ({
          transform: getComputedStyle(element).transform,
          opacity: getComputedStyle(element).opacity,
        }));
      const before = JSON.stringify(snapshot());
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      return before === JSON.stringify(snapshot());
    });
    expect(stable).toBe(true);
  } finally {
    release();
  }
});

test("validation and unexpected API errors never expose technical text", async ({
  page,
}) => {
  await setup(page);
  let count = 0;
  let failure: {
    status: number;
    json?: Record<string, unknown>;
    body?: string;
    contentType?: string;
  } = { status: 400, json: { message: "Too small: expected number to be >0" } };
  await page.route("**/api/finance/transactions", async (route) => {
    count++;
    await route.fulfill(failure);
  });
  await page.goto("/home");
  await page
    .getByRole("button", { name: "Nova movimentação", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Descrição").fill("Teste de validação");
  await dialog.getByRole("button", { name: "Salvar movimentação" }).click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Informe um valor maior que zero.",
  );
  expect(count).toBe(0);
  await dialog
    .getByRole("textbox", { name: "Valor", exact: false })
    .fill("12,50");
  const failures = [
    {
      response: {
        status: 400,
        json: { message: "Too small: expected number to be >0" },
      },
      expected: "Confira os campos preenchidos e tente novamente.",
    },
    {
      response: {
        status: 400,
        json: { code: "INVALID_AMOUNT", message: "ZodError: invalid_type" },
      },
      expected: "Informe um valor maior que zero.",
    },
    {
      response: {
        status: 400,
        json: { code: "toString", message: "Invalid input: expected number" },
      },
      expected: "Confira os campos preenchidos e tente novamente.",
    },
    {
      response: {
        status: 500,
        json: {
          code: "INVALID_AMOUNT",
          message: "PrismaClientKnownRequestError: P1000 stack trace",
        },
      },
      expected:
        "Não foi possível salvar a movimentação. Tente novamente em instantes.",
    },
    {
      response: {
        status: 502,
        contentType: "text/html",
        body: "<html>upstream technical failure</html>",
      },
      expected:
        "Não foi possível salvar a movimentação. Tente novamente em instantes.",
    },
  ];
  for (const entry of failures) {
    failure = entry.response;
    const previous = count;
    await dialog.getByRole("button", { name: "Salvar movimentação" }).click();
    await expect.poll(() => count).toBe(previous + 1);
    await expect(dialog.getByRole("alert")).toHaveText(entry.expected);
    await expect(dialog).not.toContainText(
      /Too small|ZodError|PrismaClient|P1000|stack trace|upstream|invalid_type/,
    );
  }
});

test("movement filters combine, reset and export only matching entries", async ({
  page,
}) => {
  const { period } = await setup(page, true);
  await page.goto("/transactions");
  await expect(page.locator(".transaction-row")).toHaveCount(6);
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await page.getByRole("button", { name: /^Filtros/ }).click();
  await page
    .getByRole("combobox", { name: "Tipo de movimentação", exact: true })
    .selectOption("EXPENSE");
  await page
    .getByRole("combobox", { name: "Situação da movimentação", exact: true })
    .selectOption("PLANNED");
  await expect(page.locator(".transaction-row")).toHaveCount(1);
  await page
    .getByRole("combobox", { name: "Categoria", exact: true })
    .selectOption("2");
  await page
    .getByRole("combobox", { name: "Forma de pagamento", exact: true })
    .selectOption("PIX");
  await page.getByLabel("Data inicial", { exact: true }).fill(`${period}-16`);
  await expect(page.locator(".transaction-row")).toHaveCount(0);
  await page.getByLabel("Data inicial", { exact: true }).fill(`${period}-15`);
  await page.getByLabel("Data final", { exact: true }).fill(`${period}-15`);
  await page.getByLabel("Valor mínimo (R$)", { exact: true }).fill("149,90");
  await page.getByLabel("Valor máximo (R$)", { exact: true }).fill("149,90");
  await expect(page.locator(".transaction-row")).toHaveCount(1);
  await expect(page.locator(".transaction-row")).toContainText("Internet");
  await page
    .getByRole("combobox", { name: "Forma de pagamento", exact: true })
    .selectOption("DEBIT_CARD");
  await expect(page.locator(".transaction-row")).toHaveCount(0);
  await page
    .getByRole("dialog", { name: "Filtrar movimentações" })
    .getByRole("button", { name: "Limpar filtros", exact: true })
    .click();
  await expect(page.locator(".transaction-row")).toHaveCount(6);
  await page
    .getByRole("combobox", { name: "Ordenar por", exact: true })
    .selectOption("HIGHEST");
  await expect(page.locator(".transaction-row").first()).toContainText(
    "Salário",
  );
  await page
    .getByRole("combobox", { name: "Ordenar por", exact: true })
    .selectOption("LOWEST");
  await expect(page.locator(".transaction-row").first()).toContainText(
    "Cinema e jantar",
  );
  await page
    .getByRole("combobox", { name: "Categoria", exact: true })
    .selectOption("NONE");
  await expect(page.locator(".transaction-row")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Ver 2 movimentações", exact: true })
    .click();
  const pendingDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar CSV" }).click();
  const download = await pendingDownload;
  const csv = await readFile((await download.path())!, "utf8");
  expect(csv).toContain("Salário");
  expect(csv).toContain("Projeto extra");
  expect(csv).not.toContain("Aluguel");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("more filters opens a full-height drawer without expanding the page", async ({
  page,
}, testInfo) => {
  await setup(page, true);
  await page.goto("/transactions");
  const button = page.getByRole("button", { name: /^Filtros/ });
  const rows = page.locator(".transaction-row").first();
  const before = await rows.boundingBox();
  await button.click();
  const drawer = page.getByRole("dialog", {
    name: "Filtrar movimentações",
    exact: true,
  });
  await expect(drawer).toBeVisible();
  await expect
    .poll(async () => {
      const box = (await drawer.boundingBox())!;
      return Math.abs(box.x + box.width - page.viewportSize()!.width);
    })
    .toBeLessThan(1);
  const box = (await drawer.boundingBox())!;
  expect(box.y).toBe(0);
  expect(box.height).toBe(page.viewportSize()!.height);
  expect((await rows.boundingBox())!.y).toBe(before!.y);
  await expect(
    drawer.getByRole("button", { name: "Ver 6 movimentações" }),
  ).toBeVisible();
  await drawer
    .getByRole("combobox", { name: "Categoria", exact: true })
    .selectOption("NONE");
  await expect(
    drawer.getByRole("button", { name: "Ver 2 movimentações" }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("filtros-laterais.png") });
  await page.mouse.click(5, 10);
  await expect(drawer).not.toBeVisible();
  await expect(button).toBeFocused();
  await button.click();
  await expect(
    drawer.getByRole("combobox", { name: "Categoria", exact: true }),
  ).toHaveValue("NONE");
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("modal closes on backdrop click and Escape but keeps inside clicks open", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/home");
  const open = page.getByRole("button", {
    name: "Nova movimentação",
    exact: true,
  });
  const dialog = page.getByRole("dialog");
  await open.click();
  await expect(dialog).toBeVisible();
  const bounds = (await dialog.boundingBox())!;
  await page.mouse.click(bounds.x + 8, bounds.y + 8);
  await expect(dialog).toBeVisible();
  await page.mouse.move(bounds.x + 30, bounds.y + 30);
  await page.mouse.down();
  await page.mouse.move(5, 5);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("sidebar fills the viewport and only main content scrolls", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop sidebar layout");
  await setup(page, true);
  for (const height of [600, 768, 900]) {
    await page.setViewportSize({ width: 1280, height });
    await page.goto("/home");
    await expect(
      page.getByRole("heading", { name: "Seu dinheiro, com clareza." }),
    ).toBeVisible();
    const sidebar = page.locator(".finance-sidebar");
    const exit = sidebar.getByRole("button", { name: "Sair da conta" });
    const before = await sidebar.boundingBox();
    const exitBox = await exit.boundingBox();
    expect(before?.height).toBe(height);
    expect(exitBox!.y + exitBox!.height).toBeLessThanOrEqual(height);
    await page.locator(".finance-main").evaluate((element) => {
      element.scrollTop = 300;
    });
    expect(
      await page
        .locator(".finance-main")
        .evaluate((element) => element.scrollTop),
    ).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await sidebar.boundingBox()).toEqual(before);
  }
});

async function setup(
  page: Page,
  populated = false,
  options: { expensesOnly?: boolean; income?: number } = {},
) {
  const income = options.expensesOnly ? 0 : (options.income ?? 5200);
  const plannedIncome = options.expensesOnly ? 0 : 800;
  const today = new Date();
  const period = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const categories = [
    {
      id: 1,
      name: "Alimentação",
      color: "#b59864",
      spent: 385.9,
      budget: { amount: 700, period: "*" },
    },
    {
      id: 2,
      name: "Casa",
      color: "#71927b",
      spent: 1250,
      budget: { amount: 1600, period: "*" },
    },
    { id: 3, name: "Lazer", color: "#a896b8", spent: 95, budget: null },
  ];
  const transactions = populated
    ? [
        {
          id: 1,
          kind: "INCOME",
          status: "COMPLETED",
          amount: income,
          description: "Salário",
          date: `${period}-05`,
          categoryId: null,
          category: null,
          paymentMethod: "PIX",
        },
        {
          id: 2,
          kind: "EXPENSE",
          status: "COMPLETED",
          amount: 385.9,
          description: "Compras da semana",
          date: `${period}-10`,
          categoryId: 1,
          category: categories[0],
          paymentMethod: "DEBIT_CARD",
        },
        {
          id: 3,
          kind: "EXPENSE",
          status: "COMPLETED",
          amount: 1250,
          description: "Aluguel",
          date: `${period}-07`,
          categoryId: 2,
          category: categories[1],
          paymentMethod: "PIX",
        },
        {
          id: 4,
          kind: "EXPENSE",
          status: "COMPLETED",
          amount: 95,
          description: "Cinema e jantar",
          date: `${period}-12`,
          categoryId: 3,
          category: categories[2],
          paymentMethod: "PIX",
        },
        {
          id: 5,
          kind: "EXPENSE",
          status: "PLANNED",
          amount: 149.9,
          description: "Internet",
          date: `${period}-15`,
          categoryId: 2,
          category: categories[1],
          paymentMethod: "PIX",
        },
        {
          id: 6,
          kind: "INCOME",
          status: "PLANNED",
          amount: 800,
          description: "Projeto extra",
          date: `${period}-18`,
          categoryId: null,
          category: null,
          paymentMethod: "PIX",
        },
      ]
    : [];
  const requests: {
    method: string;
    path: string;
    body: Record<string, unknown> | null;
  }[] = [];
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const body = request.postDataJSON();
    requests.push({ method: request.method(), path: url.pathname, body });
    if (url.pathname === "/api/users/refresh")
      return route.fulfill({ json: { accessToken: "browser-test-access" } });
    if (url.pathname === "/api/users/me")
      return route.fulfill({
        json: {
          user: { id: 1, name: "Diego Araújo", email: "diego@example.test" },
        },
      });
    if (url.pathname === "/api/finance/overview")
      return route.fulfill({
        json: {
          period: url.searchParams.get("period"),
          summary: populated
            ? {
                income,
                expenses: 1730.9,
                result: income - 1730.9,
                plannedIncome,
                plannedExpenses: 149.9,
                projectedResult: income + plannedIncome - 1730.9 - 149.9,
              }
            : {
                income: 0,
                expenses: 0,
                result: 0,
                plannedIncome: 0,
                plannedExpenses: 0,
                projectedResult: 0,
              },
          categories: populated ? categories : [],
          transactions: options.expensesOnly
            ? transactions.filter((entry) => entry.kind === "EXPENSE")
            : transactions,
        },
      });
    return route.fulfill({
      status: request.method() === "DELETE" ? 204 : 200,
      ...(request.method() === "DELETE" ? {} : { json: { success: true } }),
    });
  });
  return { requests, period };
}

test("income and expense categories stay separate and income never offers spending limits", async ({
  page,
}) => {
  const { requests } = await setup(page);
  await page.route("**/api/finance/overview**", (route) =>
    route.fulfill({
      json: {
        period: "2026-10",
        summary: {
          income: 80,
          expenses: 20,
          result: 60,
          plannedIncome: 0,
          plannedExpenses: 0,
          projectedResult: 60,
        },
        transactions: [],
        categories: [
          {
            id: 10,
            name: "Alimentação",
            kind: "EXPENSE",
            color: "#2563eb",
            spent: 20,
            budget: null,
          },
          {
            id: 11,
            name: "Salário",
            kind: "INCOME",
            color: "#2563eb",
            spent: 80,
            budget: null,
          },
        ],
      },
    }),
  );
  await page.goto("/transactions");
  await page
    .getByRole("button", { name: "Nova movimentação", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const category = dialog.getByRole("combobox", { name: /Categoria/ });
  await expect(
    category.getByRole("option", { name: "Alimentação", exact: true }),
  ).toHaveCount(1);
  await expect(
    category.getByRole("option", { name: "Salário", exact: true }),
  ).toHaveCount(0);
  await category.selectOption("10");
  await dialog.getByRole("button", { name: "Receita", exact: true }).click();
  await expect(category).toHaveValue("");
  await expect(
    category.getByRole("option", { name: "Alimentação", exact: true }),
  ).toHaveCount(0);
  await expect(
    category.getByRole("option", { name: "Salário", exact: true }),
  ).toHaveCount(1);
  await category.selectOption("11");
  await dialog.getByRole("button", { name: "Despesa", exact: true }).click();
  await expect(category).toHaveValue("");
  await page.keyboard.press("Escape");
  await page.goto("/categories");
  await page
    .getByRole("group", { name: "Tipo de categoria", exact: true })
    .getByRole("button", { name: "Receitas", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Salário", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Alimentação", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Definir limite", exact: false }),
  ).toHaveCount(0);
  await expect(
    page.getByText("em receitas neste mês", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Nova categoria", exact: true })
    .click();
  await expect(
    dialog.getByRole("combobox", { name: "Tipo de categoria", exact: true }),
  ).toHaveValue("INCOME");
  await dialog
    .getByRole("textbox", { name: "Nome", exact: true })
    .fill("Trabalhos extras");
  await dialog
    .getByRole("button", { name: "Salvar categoria", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  expect(
    requests.find(
      (request) =>
        request.method === "POST" && request.path === "/api/finance/categories",
    )?.body,
  ).toMatchObject({ name: "Trabalhos extras", kind: "INCOME" });
  await page
    .getByRole("button", { name: "Nova categoria", exact: true })
    .click();
  await dialog
    .getByRole("combobox", { name: "Tipo de categoria", exact: true })
    .selectOption("EXPENSE");
  await dialog.getByRole("textbox", { name: "Nome", exact: true }).fill("Casa");
  await dialog
    .getByRole("button", { name: "Salvar categoria", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page
      .getByRole("group", { name: "Tipo de categoria", exact: true })
      .getByRole("button", { name: "Despesas", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("new account opens immediately and saves without categories or salary", async ({
  page,
}) => {
  const { requests } = await setup(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Seu dinheiro, com clareza." }),
  ).toBeVisible();
  await expect(
    page.getByText("Vamos começar com uma movimentação?"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Nova movimentação", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const amount = dialog.getByRole("textbox", { name: "Valor" });
  await expect(amount).toHaveValue("0,00");
  await amount.pressSequentially("10000");
  await expect(amount).toHaveValue("100,00");
  await amount.press("Backspace");
  await expect(amount).toHaveValue("10,00");
  await amount.fill("1.234,56");
  await expect(amount).toHaveValue("1.234,56");
  expect(
    await amount.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("none");
  await amount.fill("12,50");
  await dialog.getByLabel("Descrição").fill("Café da manhã");
  await dialog.getByLabel("Repetir mensalmente").check();
  await expect(
    dialog.getByLabel("Quantidade de meses, incluindo este"),
  ).toHaveCount(0);
  await dialog.getByRole("button", { name: "Salvar movimentação" }).click();
  await expect(dialog).not.toBeVisible();
  expect(
    requests.find(
      (r) => r.method === "POST" && r.path === "/api/finance/transactions",
    )?.body,
  ).toMatchObject({
    amount: 12.5,
    categoryId: null,
    kind: "EXPENSE",
    description: "Café da manhã",
    recurring: true,
    recurrenceEndDate: null,
  });
  expect(requests.some((r) => /\/months/.test(r.path))).toBe(false);
});

test("public login and signup have accessible controls and fit the viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Seu espaço te espera." }),
  ).toBeVisible();
  await page.getByLabel("Senha", { exact: true }).fill("example-password");
  await page
    .getByRole("button", { name: "Mostrar senha", exact: true })
    .click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page
    .getByRole("button", { name: "Ocultar senha", exact: true })
    .click();
  await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
    "type",
    "password",
  );
  await page.screenshot({
    path: testInfo.outputPath("login.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Criar conta", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Um novo olhar para seu dinheiro." }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Confirmar Senha", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("responsive overview, search, monthly navigation and CSV export", async ({
  page,
}, testInfo) => {
  const { requests, period } = await setup(page, true);
  await page.goto("/home");
  await expect(
    page.getByRole("heading", { name: "Seu dinheiro, com clareza." }),
  ).toBeVisible();
  await expect(page.getByText("R$ 3.469,10", { exact: true })).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("overview.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const navigation = page.getByRole("navigation", {
    name:
      testInfo.project.name === "mobile"
        ? "Navegação principal no celular"
        : "Navegação principal",
    exact: true,
  });
  await navigation
    .getByRole("link", {
      name: testInfo.project.name === "mobile" ? "Movimentos" : "Movimentações",
      exact: true,
    })
    .click();
  await page.getByRole("searchbox").fill("Compras");
  await expect(
    page.getByText("Compras da semana", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Cinema e jantar", { exact: true }),
  ).not.toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar CSV" }).click();
  expect((await download).suggestedFilename()).toBe(`finsy-${period}.csv`);
  await page.getByRole("button", { name: "Próximo mês" }).click();
  await expect
    .poll(
      () => requests.filter((r) => r.path === "/api/finance/overview").length,
    )
    .toBeGreaterThan(1);
});

test("category and optional recurring budget can be saved", async ({
  page,
}, testInfo) => {
  const { requests } = await setup(page, true);
  await page.goto("/categories");
  await page
    .getByRole("button", { name: "Nova categoria", exact: true })
    .click();
  await page.getByRole("dialog").getByLabel("Nome").fill("Transporte");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Salvar categoria" })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    requests.find(
      (r) => r.method === "POST" && r.path === "/api/finance/categories",
    )?.body?.name,
  ).toBe("Transporte");
  const navigation = page.getByRole("navigation", {
    name:
      testInfo.project.name === "mobile"
        ? "Navegação principal no celular"
        : "Navegação principal",
    exact: true,
  });
  await navigation
    .getByRole("link", { name: "Categorias e limites", exact: true })
    .click();
  await page.getByRole("button", { name: "Ajustar limite" }).first().click();
  await page
    .getByRole("dialog")
    .getByLabel("Limite mensal (R$)")
    .fill("800,00");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Salvar limite" })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    requests.find((r) => r.method === "PUT" && r.path.endsWith("/budget"))
      ?.body,
  ).toEqual({ amount: 800, period: "*" });
});

test("expenses-only tracking shows positive spending without an inferred negative balance", async ({
  page,
}) => {
  await setup(page, true, { expensesOnly: true });
  await page.goto("/home");
  await expect(page.locator(".result-card")).toContainText("Gastos do mês");
  await expect(page.locator(".result-card > strong")).toHaveText("R$ 1.730,90");
  const balance = page
    .locator(".metric-card")
    .filter({ hasText: "Resultado do período" });
  await expect(balance.locator("strong")).toHaveText("—");
  await expect(balance).not.toContainText("Resultado planejado");
  for (const amount of await page
    .locator(".transaction-amount")
    .allTextContents()) {
    expect(amount.trim()).toMatch(/^R\$/);
    expect(amount).not.toMatch(/[−-]/);
  }
});

test("a negative balance is preserved when registered expenses exceed income", async ({
  page,
}) => {
  await setup(page, true, { income: 1000 });
  await page.goto("/home");
  const balance = page
    .locator(".metric-card")
    .filter({ hasText: "Resultado do período" });
  await expect(balance.locator("strong")).toHaveText("-R$ 730,90");
  await expect(page.locator(".result-card > strong")).toHaveText("R$ 1.730,90");
});

test("old budgets link redirects to the unified categories and limits page", async ({
  page,
}, testInfo) => {
  await setup(page, true);
  await page.goto("/budgets");
  await expect(page).toHaveURL(/\/categories$/);
  await expect(
    page.getByRole("heading", { name: "Categorias e limites", exact: true }),
  ).toBeVisible();
  const navigation = page.getByRole("navigation", {
    name:
      testInfo.project.name === "mobile"
        ? "Navegação principal no celular"
        : "Navegação principal",
    exact: true,
  });
  await expect(
    navigation.getByRole("link", { name: "Categorias e limites", exact: true }),
  ).toHaveCount(1);
  await expect(
    navigation.getByRole("link", { name: "Orçamentos", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Nova categoria", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Nova movimentação", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Restam R$ 314,10", { exact: false }),
  ).toBeVisible();
});
