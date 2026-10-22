import {test, expect} from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.route("**/api/users/refresh", route => route.fulfill({status:401,json:{code:"SESSION_EXPIRED"}}));
});

test("legal documents are public, link each other and fit a mobile viewport",async ({page}) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading",{name:"Política de Privacidade",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Responsável e contato"})).toBeVisible();
  await expect(page.getByRole("heading",{name:/Como exercer seus direitos/})).toBeVisible();
  await expect(page.getByRole("link",{name:"Termos de Uso",exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole("link",{name:"Termos de Uso",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Termos de Uso",exact:true})).toBeVisible();
  await expect(page.getByText(/não autoriza cobrança automática/)).toBeVisible();
});

test("signup requires an unchecked explicit acceptance and sends the published version",async ({page}) => {
  const requests:Record<string,unknown>[]=[];
  await page.route("**/api/users",async route=>{
    requests.push(route.request().postDataJSON());
    await route.fulfill({status:409,json:{code:"EMAIL_DUPLICATED"}});
  });
  await page.goto("/sign-up");
  await page.getByLabel("Nome",{exact:true}).fill("Privacy test");
  await page.getByLabel("Email",{exact:true}).fill("privacy@example.test");
  await page.getByLabel("Senha",{exact:true}).fill("Example-Safe-Password-9");
  await page.getByLabel("Confirmar Senha",{exact:true}).fill("Example-Safe-Password-9");
  const acceptance=page.getByRole("checkbox");
  await expect(acceptance).not.toBeChecked();
  await page.getByRole("button",{name:"Cadastrar-se",exact:true}).click();
  expect(requests).toHaveLength(0);
  await expect(page.getByRole("link",{name:"Termos de Uso",exact:true}).first()).toHaveAttribute("target","_blank");
  await acceptance.check();
  await page.getByRole("button",{name:"Cadastrar-se",exact:true}).click();
  await expect.poll(()=>requests.length).toBe(1);
  expect(requests[0].termsVersion).toBe("2026-10-22");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
