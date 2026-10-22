import { test, expect, type Page } from "@playwright/test";

async function setup(
  page: Page,
  options: { onboarding?: boolean; signedIn?: boolean } = {},
) {
  const period = "2026-10";
  let paid = false;
  let onboarded = !options.onboarding;
  let imported = false;
  let revoked = false;
  const calls: {
    path: string;
    method: string;
    body: Record<string, unknown>;
  }[] = [];
  const card = {
    id: 10,
    name: "Principal",
    closingDay: 25,
    dueDay: 5,
    limit: 2000,
    archivedAt: null,
  };
  const tx = {
    id: 7,
    kind: "EXPENSE",
    status: "PLANNED",
    amount: 100,
    description: "Internet",
    date: "2026-10-05",
    categoryId: null,
    category: null,
    paymentMethod: "PIX",
  };
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const body = request.postDataJSON() ?? {};
    calls.push({ path, method: request.method(), body });
    if (path === "/api/users/refresh")
      return route.fulfill({
        status: options.signedIn === false ? 401 : 200,
        json: { accessToken: "test-access" },
      });
    if (path === "/api/users/me")
      return route.fulfill({
        json: { user: { id: 1, name: "Ana", email: "ana@example.test" } },
      });
    if (path === "/api/users/preferences") {
      if (request.method() === "PUT" && body.onboardingComplete)
        onboarded = true;
      return route.fulfill({
        json: {
          onboardingAt: onboarded ? "2026-10-01" : null,
          reminderDays: 3,
        },
      });
    }
    if (path === "/api/users/sessions")
      return route.fulfill({
        json: [
          {
            id: "current",
            createdAt: "2026-10-21T12:00:00Z",
            expiresAt: "2026-10-28T12:00:00Z",
            current: true,
          },
          ...(!revoked
            ? [
                {
                  id: "other",
                  createdAt: "2026-10-20T12:00:00Z",
                  expiresAt: "2026-10-27T12:00:00Z",
                  current: false,
                },
              ]
            : []),
        ],
      });
    if (path === "/api/users/sessions/other") {
      revoked = true;
      return route.fulfill({ json: { success: true } });
    }
    if (path === "/api/users/support")
      return route.fulfill({ json: { email: "suporte@example.test" } });
    if (path === "/api/users/export")
      return route.fulfill({
        json: {
          version: 1,
          user: { name: "Ana" },
          transactions: [tx],
          categories: [],
          cards: [card],
        },
      });
    if (path === "/api/finance/overview")
      return route.fulfill({
        json: {
          period,
          summary: {
            income: 0,
            expenses: 0,
            plannedIncome: 0,
            plannedExpenses: 100,
            result: 0,
            projectedResult: -100,
          },
          transactions: [tx],
          categories: [],
        },
      });
    if (path === "/api/finance/cards") return route.fulfill({ json: [card] });
    if (path === "/api/finance/cards/10/invoice")
      return route.fulfill({
        json: {
          period,
          total: 100,
          pending: paid ? 0 : 100,
          committed: paid ? 0 : 100,
          entries: [
            {
              id: 2,
              description: "Compra parcelada",
              amount: 100,
              date: "2026-10-05",
              purchaseDate: "2026-09-10",
              status: paid ? "COMPLETED" : "PLANNED",
              installment: 1,
              installments: 3,
            },
          ],
        },
      });
    if (path === "/api/finance/cards/10/pay") {
      paid = true;
      return route.fulfill({ json: { updated: 1 } });
    }
    if (path === "/api/finance/comparison")
      return route.fulfill({
        json: {
          period,
          previousPeriod: "2026-09",
          current: { expenses: 300, income: 0 },
          previous: { expenses: 500, income: 0 },
          categories: [{ id: 1, name: "Mercado", current: 300, previous: 500 }],
        },
      });
    if (path === "/api/finance/reminders")
      return route.fulfill({
        json: {
          today: "2026-10-21",
          reminderDays: 3,
          entries: [{ ...tx, overdue: true }],
        },
      });
    if (path === "/api/finance/import/inspect")
      return route.fulfill({
        json: {
          format: "csv",
          headers: ["Data", "Descrição", "Valor"],
          sample: [["2026-10-20", "Compra nova", "-10,00"]],
          mapping: { date: 0, description: 1, amount: 2, kind: -1 },
          source: "account",
          signs: "negative_expenses",
          separator: ";",
          profile: "CSV",
        },
      });
    if (path === "/api/finance/import/preview")
      return route.fulfill({
        json: {
          ignoredPayments: 0,
          format: "csv",
          rows: [
            {
              date: "2026-10-20",
              description: "Compra nova",
              amount: 10,
              kind: "EXPENSE",
              sourceId: "csv:1",
              duplicate: imported,
            },
            {
              date: "2026-10-19",
              description: "Já importada",
              amount: 20,
              kind: "EXPENSE",
              sourceId: "csv:1",
              duplicate: true,
            },
          ],
        },
      });
    if (path === "/api/finance/import/confirm") {
      imported = true;
      return route.fulfill({ status: 201, json: { imported: 1, skipped: 0 } });
    }
    return route.fulfill({ json: { success: true } });
  });
  return { calls, period };
}
test("planning compares months and records invoice payment without another expense", async ({
  page,
}, info) => {
  const { calls } = await setup(page);
  await page.goto("/planning");
  await expect(
    page.getByText("R$ 200,00 a menos", { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText("Mercado", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Cartões e faturas", exact: true })
    .click();
  await expect(page.getByText("Compra parcelada · 1/3")).toBeVisible();
  await page
    .getByRole("button", { name: "Confirmar pagamento da fatura" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "sem criar uma segunda despesa",
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar pagamento", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Confirmar pagamento da fatura" }),
  ).toHaveCount(0);
  expect(
    calls.filter(
      (c) => c.path === "/api/finance/transactions" && c.method === "POST",
    ),
  ).toHaveLength(0);
  expect(calls.some((c) => c.path === "/api/finance/cards/10/pay")).toBe(true);
  await page.screenshot({
    path: info.outputPath("cards-and-invoice.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("statement import requires review and ignores imported duplicates", async ({
  page,
}) => {
  const { calls } = await setup(page);
  await page.goto("/planning?tab=import");
  await page.locator('input[type="file"]').setInputFiles({
    name: "extrato.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("Data;Descrição;Valor\n2026-10-20;Compra nova;-10,00"),
  });
  await page
    .getByRole("button", { name: "Revisar lançamentos", exact: true })
    .click();
  await expect(page.getByText("1 de 2 lançamentos selecionados")).toBeVisible();
  await expect(page.getByRole("checkbox").nth(1)).toBeDisabled();
  expect(calls.filter((c) => c.path.endsWith("/confirm"))).toHaveLength(0);
  await page
    .getByRole("button", { name: "Importar 1 lançamentos", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar importação", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "1 movimentações importadas",
  );
  expect(
    calls.find((c) => c.path.endsWith("/confirm"))?.body.rows as unknown[],
  ).toHaveLength(1);
});
test("unfamiliar CSV maps columns, decodes accents and leaves possible manual duplicates unselected", async ({
  page,
}) => {
  await setup(page);
  let decoded = "";
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith("/import/inspect"))
      decoded = request.postDataJSON()?.text ?? "";
  });
  await page.route("**/api/finance/import/inspect", (route) =>
    route.fulfill({
      json: {
        format: "csv",
        headers: ["Quando", "Evento", "Quantia"],
        sample: [["2026-10-20", "Café", "-12,50"]],
        mapping: { date: -1, description: -1, amount: -1, kind: -1 },
        source: "account",
        signs: "negative_expenses",
        separator: ";",
        profile: "CSV",
      },
    }),
  );
  await page.route("**/api/finance/import/preview", (route) =>
    route.fulfill({
      json: {
        ignoredPayments: 0,
        format: "csv",
        rows: [
          {
            date: "2026-10-20",
            description: "Café",
            amount: 12.5,
            kind: "EXPENSE",
            sourceId: "csv:1",
            duplicate: false,
            possibleDuplicate: true,
          },
          {
            date: "2026-10-20",
            description: "Compra inédita",
            amount: 20,
            kind: "EXPENSE",
            sourceId: "csv:1",
            duplicate: false,
            possibleDuplicate: false,
          },
        ],
      },
    }),
  );
  await page.goto("/planning?tab=import");
  await page.locator('input[type="file"]').setInputFiles({
    name: "outro-banco.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(
      "Quando;Evento;Quantia\n2026-10-20;Café;-12,50",
      "latin1",
    ),
  });
  const review = page.getByRole("button", {
    name: "Revisar lançamentos",
    exact: true,
  });
  await expect(review).toBeDisabled();
  await page
    .getByRole("combobox", { name: "Coluna da data", exact: true })
    .selectOption("0");
  await page
    .getByRole("combobox", { name: "Coluna da descrição", exact: true })
    .selectOption("1");
  await page
    .getByRole("combobox", { name: "Coluna do valor", exact: true })
    .selectOption("2");
  await review.click();
  await expect(
    page.getByText("1 de 2 lançamentos selecionados", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("checkbox").first()).not.toBeChecked();
  await expect(page.getByRole("checkbox").nth(1)).toBeChecked();
  await expect(
    page.getByText("Possível duplicado: confira", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Como interpretar os valores", exact: true })
    .selectOption("positive_expenses");
  await expect(
    page.getByRole("button", { name: "Importar 1 lançamentos", exact: true }),
  ).toHaveCount(0);
  expect(decoded).toContain("Café");
});

test("Nubank invoice requires a card and preserves compensating refunds in the review", async ({
  page,
}) => {
  const { calls } = await setup(page);
  await page.route("**/api/finance/import/inspect", (route) =>
    route.fulfill({
      json: {
        format: "csv",
        headers: ["date", "title", "amount"],
        sample: [],
        mapping: { date: 0, description: 1, amount: 2, kind: -1 },
        source: "card",
        signs: "positive_expenses",
        separator: ",",
        profile: "Fatura Nubank",
      },
    }),
  );
  await page.route("**/api/finance/import/preview", (route) =>
    route.fulfill({
      json: {
        ignoredPayments: 1,
        format: "csv",
        rows: [
          {
            date: "2026-10-19",
            description: "Loja - Parcela 1/5",
            amount: 96,
            kind: "EXPENSE",
            sourceId: "csv:1",
            duplicate: false,
          },
          {
            date: "2026-10-20",
            description: "Estorno da loja",
            amount: 10,
            kind: "INCOME",
            sourceId: "csv:1",
            duplicate: false,
          },
        ],
      },
    }),
  );
  await page.goto("/planning?tab=import");
  await page.locator('input[type="file"]').setInputFiles({
    name: "nubank.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("date,title,amount\n2026-10-19,Loja,96.00"),
  });
  await expect(
    page.getByRole("combobox", { name: "Origem dos lançamentos", exact: true }),
  ).toHaveValue("card");
  const review = page.getByRole("button", {
    name: "Revisar lançamentos",
    exact: true,
  });
  await expect(review).toBeDisabled();
  await page
    .getByRole("combobox", { name: "Cartão da fatura", exact: true })
    .selectOption("10");
  await review.click();
  await expect(
    page.getByText("1 pagamentos de fatura ignorados", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("Estorno da loja", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Importar 2 lançamentos", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Nenhuma fatura será marcada como paga",
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar importação", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "movimentações importadas",
  );
  expect(
    calls.find((call) => call.path.endsWith("/confirm"))?.body.options,
  ).toMatchObject({ source: "card", cardId: 10, signs: "positive_expenses" });
  expect(calls.some((call) => call.path.endsWith("/pay"))).toBe(false);
});

test("installment purchase sends total and chosen card; pending action opens as unpaid", async ({
  page,
}) => {
  const { calls } = await setup(page);
  await page.goto("/transactions");
  await page
    .getByRole("button", { name: "Nova movimentação", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await modal.getByLabel("Forma de pagamento").selectOption("CREDIT_CARD");
  await modal.getByLabel("Cartão", { exact: true }).selectOption("10");
  await modal
    .getByRole("combobox", { name: "Como lançar no crédito", exact: true })
    .selectOption("installments");
  await modal.getByLabel("Parcelamento", { exact: false }).selectOption("3");
  await modal
    .getByRole("textbox", { name: "Valor total da compra" })
    .fill("100,00");
  await modal.getByLabel("Descrição").fill("Compra parcelada");
  await modal.getByRole("button", { name: "Salvar movimentação" }).click();
  await expect(modal).not.toBeVisible();
  expect(
    calls.find((c) => c.path === "/api/finance/transactions")?.body,
  ).toMatchObject({
    amount: 100,
    installments: 3,
    cardId: 10,
    status: "PLANNED",
  });
});
test("onboarding is optional, persisted and explains expense-only use", async ({
  page,
}) => {
  const { calls } = await setup(page, { onboarding: true });
  await page.goto("/home");
  await expect(
    page.getByRole("heading", { name: "Comece do seu jeito" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Você pode acompanhar só os gastos. Não precisa informar salário.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Entendi, vamos começar" }).click();
  await expect(
    page.getByRole("heading", { name: "Comece do seu jeito" }),
  ).toHaveCount(0);
  expect(
    calls.some(
      (c) => c.path === "/api/users/preferences" && c.body.onboardingComplete,
    ),
  ).toBe(true);
});
test("overdue reminders open the correct month and transaction", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/planning?tab=reminders");
  await expect(page.getByText("A pagar · 05/10/2026 · Vencida")).toBeVisible();
  await page.getByRole("link", { name: "Revisar", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByLabel("Descrição")).toHaveValue(
    "Internet",
  );
});
test("settings revoke other sessions, export data and protect account deletion", async ({
  page,
}) => {
  const { calls } = await setup(page);
  await page.goto("/settings");
  await expect(page.getByText("Outra sessão", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Encerrar", exact: true }).click();
  await expect(page.getByText("Outra sessão", { exact: true })).toHaveCount(0);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar todos os dados" }).click();
  expect((await download).suggestedFilename()).toBe("finsy-meus-dados.json");
  await page.getByRole("button", { name: "Excluir minha conta" }).click();
  const modal = page.getByRole("dialog");
  await expect(
    modal.getByRole("button", { name: "Excluir conta e dados" }),
  ).toBeDisabled();
  await modal.getByLabel("Sua senha").fill("senha-teste-123");
  await modal.getByLabel("Digite EXCLUIR para confirmar").fill("EXCLUIR");
  await modal.getByRole("button", { name: "Excluir conta e dados" }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(
    calls.find((c) => c.path === "/api/users/delete-account")?.body,
  ).toEqual({ password: "senha-teste-123", confirmation: "EXCLUIR" });
});
test("password recovery uses neutral confirmation and reset retains fragment token under StrictMode", async ({
  page,
}) => {
  const { calls } = await setup(page, { signedIn: false });
  await page.goto("/forgot-password");
  await page.getByLabel("E-mail", { exact: true }).fill("ana@example.test");
  await page
    .getByRole("button", { name: "Enviar link de recuperação" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Se este e-mail estiver cadastrado",
  );
  const token = "b".repeat(64);
  await page.goto(`/reset-password#token=${token}`);
  await page.getByLabel("Nova senha", { exact: true }).fill("senha-atualizada");
  await page
    .getByLabel("Confirme a nova senha", { exact: true })
    .fill("senha-atualizada");
  await page.getByRole("button", { name: "Salvar nova senha" }).click();
  await expect(page.getByRole("status")).toContainText("Senha atualizada");
  expect(
    calls.find((c) => c.path === "/api/users/reset-password")?.body.token,
  ).toBe(token);
  expect(page.url()).not.toContain(token);
});

test("profile edits stay inside settings and email changes require the current password", async ({
  page,
}) => {
  await setup(page);
  const updates: Record<string, unknown>[] = [];
  let pendingEmail: string | null = null;
  await page.route("**/api/users/email-change", (route) =>
    route.fulfill({ json: { pendingEmail } }),
  );
  await page.route("**/api/users", async (route) => {
    const body = route.request().postDataJSON();
    updates.push(body);
    if (body.currentPassword === "wrong")
      return route.fulfill({ status: 400, json: { code: "WRONG_PASSWORD" } });
    if (body.email) pendingEmail = body.email;
    return route.fulfill({
      status: body.email ? 202 : 200,
      json: {
        id: 1,
        name: "Ana Atualizada",
        email: "ana@example.test",
        ...(body.email
          ? { pendingEmail: body.email, emailChangePending: true }
          : {}),
      },
    });
  });
  await page.goto("/settings");
  const save = page.getByRole("button", {
    name: "Salvar altera\u00e7\u00f5es",
    exact: true,
  });
  await expect(save).toBeDisabled();
  await page.getByLabel("Nome", { exact: true }).fill("Ana Atualizada");
  await save.click();
  await expect(page.getByRole("status")).toContainText("Perfil atualizado");
  expect(updates[0]).toEqual({ name: "Ana Atualizada" });
  await expect(page).toHaveURL(/\/settings$/);
  await page.getByLabel("E-mail", { exact: true }).fill("nova@example.test");
  const password = page.getByLabel("Senha atual para alterar o e-mail", {
    exact: true,
  });
  await expect(password).toBeVisible();
  await save.click();
  expect(updates).toHaveLength(1);
  await password.fill("wrong");
  await save.click();
  await expect(page.locator("#profile").getByRole("alert")).toContainText(
    /senha/i,
  );
  await expect(page).toHaveURL(/\/settings$/);
  await password.fill("current-password");
  await save.click();
  await expect(page.locator("#profile").getByRole("status")).toContainText(
    "Confirme a altera\u00e7\u00e3o",
  );
  await expect(page.getByLabel("E-mail", { exact: true })).toHaveValue(
    "ana@example.test",
  );
  expect(updates[2]).toEqual({
    email: "nova@example.test",
    currentPassword: "current-password",
  });
  await expect(password).toHaveCount(0);
  await expect(save).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("password link requests stay authenticated in settings and use the saved email", async ({
  page,
}) => {
  const { calls } = await setup(page);
  await page.goto("/settings");
  await page.getByLabel("E-mail", { exact: true }).fill("unsaved@example.test");
  await page
    .getByRole("button", {
      name: "Enviar link para redefinir senha",
      exact: true,
    })
    .click();
  await expect(page.getByRole("status")).toContainText("Pedido enviado");
  await expect(page).toHaveURL(/\/settings$/);
  expect(
    calls.find((c) => c.path === "/api/users/forgot-password")?.body,
  ).toEqual({ email: "ana@example.test" });
  expect(calls.filter((c) => c.path === "/api/users/logout")).toHaveLength(0);
  await expect(
    page.getByRole("heading", { name: "Configura\u00e7\u00f5es", exact: true }),
  ).toBeVisible();
  await page.goto("/settings/profile");
  await expect(page).toHaveURL(/\/settings#profile$/);
  await expect(page.getByLabel("Nome", { exact: true })).toBeVisible();
  await page.goto("/forgot-password");
  await expect(page).toHaveURL(/\/settings#password$/);
  await page.goto("/reset-password#token=" + "c".repeat(64));
  await page
    .getByRole("link", {
      name: "Voltar para configura\u00e7\u00f5es",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/settings#password$/);
});

test("email confirmation requires an explicit click, hides the token and requires a fresh login", async ({
  page,
}) => {
  const { calls } = await setup(page);
  const token = "d".repeat(64);
  await page.goto("/confirm-email#token=" + token);
  await expect(
    page.getByRole("button", { name: "Confirmar novo e-mail", exact: true }),
  ).toBeVisible();
  expect(
    calls.filter((c) => c.path === "/api/users/confirm-email"),
  ).toHaveLength(0);
  expect(page.url()).not.toContain(token);
  await page
    .getByRole("button", { name: "Confirmar novo e-mail", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("E-mail confirmado");
  expect(
    calls.find((c) => c.path === "/api/users/confirm-email")?.body,
  ).toEqual({ token });
  await expect(
    page.getByRole("link", { name: "Entrar na conta", exact: true }),
  ).toHaveAttribute("href", "/login");
});

test("settings let an existing account explicitly accept the current terms", async ({page}) => {
  await setup(page);
  let accepted = false;
  let posts = 0;
  await page.route("**/api/users/legal", async route => {
    if (route.request().method() === "POST") {
      expect(route.request().postDataJSON()).toEqual({termsVersion:"2026-10-22"});
      accepted = true; posts++;
      return route.fulfill({json:{success:true}});
    }
    return route.fulfill({json:{currentVersion:"2026-10-22",acceptedVersion:accepted ? "2026-10-22" : null,acceptedAt:accepted ? "2026-10-22T12:00:00Z" : null}});
  });
  await page.goto("/settings");
  await expect(page.getByRole("link",{name:"Política de Privacidade",exact:true})).toBeVisible();
  const accept = page.getByRole("button",{name:"Registrar aceite",exact:true});
  await expect(accept).toBeDisabled();
  expect(posts).toBe(0);
  await page.getByRole("checkbox",{name:/Li e aceito os Termos/}).check();
  await accept.click();
  await expect(page.getByText(/Termos aceitos em/)).toBeVisible();
  expect(posts).toBe(1);
});

test("common new passwords are blocked before submitting a reset", async ({
  page,
}) => {
  const { calls } = await setup(page, { signedIn: false });
  await page.goto("/reset-password#token=" + "e".repeat(64));
  await page.getByLabel("Nova senha", { exact: true }).fill("12345678");
  await page
    .getByLabel("Confirme a nova senha", { exact: true })
    .fill("12345678");
  await page
    .getByRole("button", { name: "Salvar nova senha", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "menos comum" }),
  ).toBeVisible();
  expect(
    calls.filter((c) => c.path === "/api/users/reset-password"),
  ).toHaveLength(0);
});
