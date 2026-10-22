import { test, expect, type Page } from "@playwright/test";

async function setupFlow(page: Page) {
  let rows = [
    {
      id: 1,
      description: "Assinatura confirmada",
      amount: 50,
      isForecast: false,
      seriesId: "repeat",
      installment: null,
      installments: null,
    },
    {
      id: 2,
      description: "Assinatura planejada",
      amount: 40,
      isForecast: true,
      seriesId: "repeat",
      installment: null,
      installments: null,
    },
    {
      id: 3,
      description: "Compra parcelada",
      amount: 10,
      isForecast: false,
      seriesId: "purchase",
      installment: 1,
      installments: 3,
    },
  ].map((row) => ({
    ...row,
    kind: "EXPENSE",
    status: "PLANNED",
    date: "2026-10-20",
    purchaseDate: "2026-10-20",
    dueDate: "2026-11-05",
    invoicePeriod: "2026-11",
    cardId: 10,
    categoryId: null,
    category: null,
    paymentMethod: "CREDIT_CARD",
    paidAt: null as string | null,
  }));
  const calls: { path: string; body: Record<string, unknown> }[] = [];
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const body = request.postDataJSON() ?? {};
    calls.push({ path, body });
    let data: unknown = {};
    if (path.endsWith("/refresh")) data = { accessToken: "test" };
    else if (path.endsWith("/me")) data = { user: { id: 1, name: "Ana" } };
    else if (path.endsWith("/preferences"))
      data = { onboardingAt: "2026-10-01" };
    else if (path.endsWith("/reminders"))
      data = { entries: [], today: "2026-10-21" };
    else if (path.endsWith("/overview"))
      data = {
        transactions: rows,
        categories: [],
        summary: {
          income: 0,
          expenses: rows
            .filter((r) => !r.isForecast)
            .reduce((s, r) => s + r.amount, 0),
          plannedIncome: 0,
          plannedExpenses: 100,
          result: -60,
          projectedResult: -100,
        },
      };
    else if (path.endsWith("/cards"))
      data = [
        {
          id: 10,
          name: "Principal",
          closingDay: 25,
          dueDay: 5,
          limit: 1000,
          archivedAt: null,
        },
      ];
    else if (path.endsWith("/invoice"))
      data = {
        total: rows
          .filter((r) => !r.isForecast)
          .reduce((s, r) => s + r.amount, 0),
        pending: rows
          .filter((r) => !r.isForecast && r.status === "PLANNED")
          .reduce((s, r) => s + r.amount, 0),
        forecastTotal: rows
          .filter((r) => r.isForecast)
          .reduce((s, r) => s + r.amount, 0),
        committed: 60,
        entries: rows,
      };
    else if (path.endsWith("/pay")) {
      rows = rows.map((r) =>
        r.isForecast
          ? r
          : { ...r, status: "COMPLETED", paidAt: body.paymentDate },
      );
      data = { updated: 2 };
    } else if (
      /\/transactions\/\d+$/.test(path) &&
      request.method() === "PUT"
    ) {
      rows = rows.map((r) =>
        r.id === Number(path.split("/").at(-1)) ? { ...r, ...body } : r,
      );
    } else if (path.endsWith("/future")) {
      rows = rows.filter((r) => !r.isForecast);
      data = { removed: 1 };
    } else if (path.endsWith("/transactions") && request.method() === "POST")
      data = { date: body.date };
    await route.fulfill({ json: data });
  });
  return calls;
}

test("confirming a forecast confirms the purchase without paying it; invoice link selects its card and month", async ({
  page,
}) => {
  const calls = await setupFlow(page);
  await page.goto("/transactions?period=2026-10");
  await expect(
    page.getByRole("button", {
      name: "Confirmar pagamento: Assinatura confirmada",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Confirmar compra: Assinatura planejada",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Confirmar compra: Assinatura planejada",
      exact: true,
    }),
  ).toHaveCount(0);
  expect(
    calls.find((c) => c.path === "/api/finance/transactions/2")?.body,
  ).toMatchObject({ isForecast: false, status: "PLANNED" });
  expect(calls.some((c) => c.path.endsWith("/pay"))).toBe(false);
  await page
    .getByRole("link", {
      name: "Ver fatura: Assinatura confirmada",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("combobox", { name: "Cartão", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('input[type="month"]')).toHaveValue("2026-11");
  await expect(
    page.getByRole("heading", { name: "Fatura de Principal", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".invoice-list time").first()).toContainText(
    "20/10/2026",
  );
});

test("credit modes are exclusive and returning to Pix clears installment state", async ({
  page,
}) => {
  const calls = await setupFlow(page);
  await page.goto("/transactions");
  await page
    .getByRole("button", { name: "Nova movimentação", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await expect(
    modal.getByRole("combobox", { name: "Parcelamento", exact: true }),
  ).toHaveCount(0);
  await modal.getByLabel("Forma de pagamento").selectOption("CREDIT_CARD");
  const mode = modal.getByRole("combobox", {
    name: "Como lançar no crédito",
    exact: true,
  });
  await mode.selectOption("installments");
  await modal
    .getByRole("combobox", { name: "Parcelamento", exact: true })
    .selectOption("3");
  await mode.selectOption("recurring");
  await expect(modal.locator('input[type="date"]')).toHaveCount(1);
  await expect(
    modal.getByText("Repete mensalmente até você cancelar", { exact: false }),
  ).toBeVisible();
  await modal
    .getByRole("checkbox", { name: "Definir término (opcional)", exact: true })
    .check();
  await expect(modal.getByLabel("Repetir até", { exact: true })).toBeVisible();
  await modal
    .getByRole("checkbox", { name: "Definir término (opcional)", exact: true })
    .uncheck();
  await expect(
    modal.getByRole("combobox", { name: "Parcelamento", exact: true }),
  ).toHaveCount(0);
  await modal
    .getByRole("combobox", { name: "Dia do mês", exact: true })
    .selectOption("1");
  await mode.selectOption("single");
  await expect(
    modal.getByRole("combobox", { name: "Dia do mês", exact: true }),
  ).toHaveCount(0);
  await mode.selectOption("installments");
  await modal.getByLabel("Forma de pagamento").selectOption("PIX");
  await expect(mode).toHaveCount(0);
  await modal
    .getByRole("checkbox", { name: "Repetir mensalmente", exact: true })
    .check();
  await modal
    .getByRole("combobox", { name: "Dia do mês", exact: true })
    .selectOption("1");
  await modal.locator('input[inputmode="numeric"]').fill("100,00");
  await modal.getByLabel("Descrição", { exact: true }).fill("Recorrência Pix");
  await modal
    .getByRole("button", { name: "Salvar movimentação", exact: true })
    .click();
  await expect(modal).not.toBeVisible();
  expect(
    calls.find((c) => c.path === "/api/finance/transactions")?.body,
  ).toMatchObject({
    installments: 1,
    recurring: true,
    recurrenceEndDate: null,
    repeatDay: 1,
    isForecast: false,
    paymentMethod: "PIX",
  });
});

test("continuous subscriptions can be edited and cancelled from planning", async ({
  page,
}) => {
  await setupFlow(page);
  let rule = {
    id: "netflix",
    description: "Netflix",
    amount: 39.9,
    day: 10,
    startDate: "2026-10-10",
    endDate: null as string | null,
    cancelledAt: null as string | null,
    paymentMethod: "CREDIT_CARD",
    kind: "EXPENSE",
    card: { name: "Principal" },
  };
  const updates: Record<string, unknown>[] = [];
  await page.route(/\/api\/finance\/recurrences(?:\/.*)?$/, async (route) => {
    const request = route.request();
    if (request.method() === "PUT") {
      const body = request.postDataJSON();
      updates.push(body);
      rule = { ...rule, ...body };
      await route.fulfill({ json: { updated: 11 } });
    } else if (request.method() === "POST") {
      rule = { ...rule, cancelledAt: "2026-10-21T12:00:00Z" };
      await route.fulfill({ json: { cancelled: true, removed: 11 } });
    } else
      await route.fulfill({
        json: new URL(request.url()).pathname.endsWith("/recurrences")
          ? [rule]
          : rule,
      });
  });
  await page.goto("/planning?tab=recurrences");
  await expect(
    page.getByRole("heading", { name: "Assinaturas e recorrências" }),
  ).toBeVisible();
  await expect(
    page.getByText("Ativa até cancelar", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Editar recorrência: Netflix", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Descrição", { exact: true }).fill("Netflix Premium");
  await dialog
    .getByRole("combobox", { name: "Dia do mês", exact: true })
    .selectOption("31");
  await dialog
    .getByRole("button", { name: "Atualizar próximas cobranças", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  expect(updates[0]).toMatchObject({
    description: "Netflix Premium",
    day: 31,
    endDate: null,
    amount: 39.9,
  });
  await page
    .getByRole("button", {
      name: "Editar recorrência: Netflix Premium",
      exact: true,
    })
    .click();
  await expect(dialog.getByLabel("Descrição", { exact: true })).toHaveValue(
    "Netflix Premium",
  );
  await expect(
    dialog.getByRole("combobox", { name: "Dia do mês", exact: true }),
  ).toHaveValue("31");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole("button", {
      name: "Cancelar recorrência: Netflix Premium",
      exact: true,
    })
    .click();
  await expect(dialog).toContainText("compras confirmadas");
  await dialog
    .getByRole("button", { name: "Confirmar cancelamento", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByText("Cancelada", { exact: false })).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Editar recorrência: Netflix Premium",
      exact: true,
    }),
  ).toHaveCount(0);
});

test("invoice forecasts stay separate and are not marked paid with confirmed purchases", async ({
  page,
}) => {
  await setupFlow(page);
  await page.goto("/planning?tab=cards&period=2026-11&card=10");
  await expect(
    page.getByText("Cobranças planejadas:", { exact: false }),
  ).toBeVisible();
  await expect(
    page.locator(".comparison-totals article").first(),
  ).toContainText("R$ 60,00");
  await expect(page.locator(".invoice-list")).toContainText(
    "Planejada para 20/10/2026",
  );
  await page
    .getByRole("button", { name: "Confirmar pagamento da fatura", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("As datas das compras");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar pagamento", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Confirmar pagamento da fatura",
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(
    page
      .locator(".invoice-list")
      .getByText("Cobrança planejada — ainda não realizada", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".invoice-list time").first()).toContainText(
    "20/10/2026",
  );
});

test("stopping recurrence preserves confirmed purchases and does not offer installment cancellation", async ({
  page,
}) => {
  await setupFlow(page);
  await page.goto("/transactions?period=2026-10");
  await expect(
    page.getByRole("button", {
      name: "Cancelar próximas: Compra parcelada",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Cancelar próximas: Assinatura confirmada",
      exact: true,
    })
    .click();
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText(
    "Compras confirmadas e pagamentos realizados serão preservados",
  );
  await modal
    .getByRole("button", { name: "Cancelar próximos lançamentos", exact: true })
    .click();
  await expect(page.locator(".transaction-row")).toHaveCount(2);
  await expect(
    page.getByText("Assinatura confirmada", { exact: true }),
  ).toBeVisible();
});

for (const scenario of ["today", "future", "future-back-to-today"] as const) {
  test(`credit purchase hides situation and derives forecast from date: ${scenario}`, async ({
    page,
  }) => {
    const calls = await setupFlow(page);
    const today = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/Sao_Paulo",
    }).format(new Date());
    await page.goto("/transactions");
    await page
      .getByRole("button", { name: "Nova movimentação", exact: true })
      .click();
    const modal = page.getByRole("dialog");
    await expect(
      modal.getByRole("combobox", { name: "Situação", exact: true }),
    ).toHaveCount(1);
    await modal.getByLabel("Forma de pagamento").selectOption("CREDIT_CARD");
    await modal
      .getByRole("combobox", { name: "Cartão", exact: true })
      .selectOption("10");
    await expect(
      modal.getByRole("combobox", { name: "Situação da compra", exact: true }),
    ).toHaveCount(0);
    await expect(
      modal.getByRole("combobox", { name: "Situação", exact: true }),
    ).toHaveCount(0);
    await modal
      .locator('input[type="date"]')
      .fill(scenario === "today" ? today : "2099-01-10");
    if (scenario === "future-back-to-today")
      await modal.locator('input[type="date"]').fill(today);
    await modal.locator('input[inputmode="numeric"]').fill("100,00");
    await modal
      .getByLabel("Descrição", { exact: true })
      .fill("Compra sem situação");
    await modal
      .getByRole("button", { name: "Salvar movimentação", exact: true })
      .click();
    if (scenario === "future") {
      await expect(modal.getByRole("alert")).toContainText("até hoje");
      expect(calls.some((c) => c.path === "/api/finance/transactions")).toBe(
        false,
      );
      return;
    }
    await expect(modal).not.toBeVisible();
    expect(
      calls.find((c) => c.path === "/api/finance/transactions")?.body,
    ).toMatchObject({
      cardId: 10,
      status: "PLANNED",
      isForecast: false,
      date: today,
    });
    expect(calls.some((c) => c.path.endsWith("/pay"))).toBe(false);
  });
}

test("editing a forecast without the situation field does not confirm or pay it", async ({
  page,
}) => {
  const calls = await setupFlow(page);
  await page.goto("/transactions?period=2026-10");
  await page
    .getByRole("button", { name: "Editar Assinatura planejada", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await expect(
    modal.getByRole("combobox", { name: "Situação da compra", exact: true }),
  ).toHaveCount(0);
  await modal
    .getByLabel("Descrição", { exact: true })
    .fill("Assinatura planejada editada");
  await modal
    .getByRole("button", { name: "Salvar movimentação", exact: true })
    .click();
  await expect(modal).not.toBeVisible();
  expect(
    calls.find((c) => c.path === "/api/finance/transactions/2")?.body,
  ).toMatchObject({ isForecast: true, status: "PLANNED" });
  expect(calls.some((c) => c.path.endsWith("/pay"))).toBe(false);
});

test("planned reminders create no movements until the real expense is saved", async ({
  page,
}) => {
  const calls = await setupFlow(page);
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
  let plans: {
    id: number;
    description: string;
    amount: number | null;
    date: string;
    notes: string;
  }[] = [];
  await page.route("**/api/finance/planned-expenses**", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      calls.push({ path: "/api/finance/planned-expenses", body });
      plans = [{ ...body, id: 50 }];
      await route.fulfill({ status: 201, json: plans[0] });
    } else await route.fulfill({ json: plans });
  });
  await page.route("**/api/finance/transactions", async (route) => {
    const body = route.request().postDataJSON();
    calls.push({ path: "/api/finance/transactions", body });
    plans = [];
    await route.fulfill({ status: 201, json: { id: 100, date: today } });
  });
  await page.goto("/planning?tab=future");
  await expect(
    page.getByText("Nenhum gasto planejado para este m\u00eas."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Planejar gasto", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await expect(modal.getByRole("combobox")).toHaveCount(0);
  await modal
    .getByLabel("O que pretende gastar?", { exact: true })
    .fill("Novo lembrete");
  await modal.locator('input[type="date"]').fill("2099-01-10");
  await modal
    .getByRole("button", { name: "Salvar lembrete", exact: true })
    .click();
  await expect(modal).not.toBeVisible();
  expect(
    calls.filter((c) => c.path === "/api/finance/transactions"),
  ).toHaveLength(0);
  expect(
    calls.find((c) => c.path === "/api/finance/planned-expenses")?.body,
  ).toMatchObject({
    description: "Novo lembrete",
    amount: null,
    date: "2099-01-10",
  });
  await expect(
    page.getByText("Valor a definir", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Registrar gasto: Novo lembrete",
      exact: true,
    })
    .click();
  await expect(modal.locator('input[type="date"]')).toHaveValue(today);
  await expect(
    modal.getByLabel("Descri\u00e7\u00e3o", { exact: true }),
  ).toHaveValue("Novo lembrete");
  await modal.getByRole("button", { name: "Fechar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Novo lembrete", exact: true }),
  ).toBeVisible();
  expect(
    calls.filter((c) => c.path === "/api/finance/transactions"),
  ).toHaveLength(0);
  await page
    .getByRole("button", {
      name: "Registrar gasto: Novo lembrete",
      exact: true,
    })
    .click();
  await modal.locator('input[inputmode="numeric"]').fill("12,00");
  await modal
    .getByRole("button", { name: "Salvar movimenta\u00e7\u00e3o", exact: true })
    .click();
  await expect(modal).not.toBeVisible();
  expect(
    calls.find((c) => c.path === "/api/finance/transactions")?.body,
  ).toMatchObject({
    plannedExpenseId: 50,
    amount: 12,
    date: today,
    status: "COMPLETED",
    kind: "EXPENSE",
  });
  await expect(
    page.getByRole("heading", { name: "Novo lembrete", exact: true }),
  ).toHaveCount(0);
});
