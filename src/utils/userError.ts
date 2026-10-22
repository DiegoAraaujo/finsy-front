import { AxiosError } from "axios";

const messages: Record<string, string> = {
  WEAK_PASSWORD: "Escolha uma senha menos comum. Evite sequências, repetições e senhas fáceis de adivinhar.",
  EMAIL_DUPLICATED: "Este e-mail já está em uso. Escolha outro endereço.",
  EMAIL_CHANGE_EXPIRED: "Este link de confirmação expirou ou já foi usado. Solicite uma nova alteração em Configurações.",
  ACCOUNT_CHANGED: "Os dados da conta mudaram. Atualize a página e tente novamente.",
  TEMPORARILY_UNAVAILABLE: "O serviço está temporariamente indisponível. Tente novamente em instantes.",
  PLAN_NOT_FOUND: "Este lembrete não está mais disponível. Atualize a página.",
  PLAN_ALREADY_REGISTERED: "Este lembrete já foi concluído ou removido. Atualize a página antes de continuar.",
  FUTURE_INCOME_NOT_ALLOWED:
    "Receitas com data futura não podem ser registradas. Importe apenas recebimentos que já aconteceram.",
  USE_FUTURE_PLANNING:
    "Registre movimentações apenas até hoje. Para um gasto futuro, use Planejamento → Gastos planejados.",
  INVALID_FUTURE_PLANNING:
    "Escolha uma data futura para planejar uma despesa. Receitas futuras não podem ser cadastradas.",
  CATEGORY_KIND_IMMUTABLE:
    "O tipo desta categoria é fixo para preservar seu histórico. Crie outra categoria para receitas ou despesas.",
  IMPORT_MULTIPLE_ACCOUNTS:
    "Este arquivo reúne mais de uma conta ou cartão. Exporte e importe uma conta ou fatura por vez.",
  IMPORT_CURRENCY:
    "Este arquivo contém valores em outra moeda. Importe um extrato em reais; o Finsy ainda não faz conversão de moedas.",
  INVALID_RECURRENCE_END:
    "O término precisa ser igual ou posterior ao início da recorrência.",
  RECURRENCE_NOT_FOUND:
    "Esta recorrência não está disponível. Atualize a página.",
  RECURRENCE_CANCELLED:
    "Esta recorrência já foi cancelada. Cadastre uma nova se quiser voltar a usá-la.",
  FUTURE_REALIZED_TRANSACTION:
    "Essa data ainda não chegou. Registre como movimentação planejada ou informe a data em que a compra, pagamento ou recebimento aconteceu.",
  CARD_REQUIRED: "Selecione o cartão para vincular a compra à fatura.",
  INVALID_FORECAST:
    "Uma compra confirmada não pode voltar a ser movimentação planejada. Confira os dados do lançamento.",
  USE_INVOICE_PAYMENT:
    "Para quitar compras no cartão, confirme o pagamento na fatura.",
  CANNOT_CANCEL_INSTALLMENTS:
    "Parcelas pertencem a uma compra já registrada. O cancelamento de repetições vale apenas para cobranças recorrentes.",
  PAYMENT_DATE_IN_FUTURE:
    "Informe a data em que o pagamento aconteceu. Ela não pode estar no futuro.",
  PAYMENT_BEFORE_PURCHASE:
    "O pagamento não pode ter acontecido antes das compras desta fatura.",
  INVALID_INSTALLMENTS:
    "Parcelamento está disponível apenas para despesas no crédito.",
  INVALID_REPEAT_DAY:
    "Escolha um dia do mês entre 1 e 31 para a repetição mensal.",
  RESET_EXPIRED:
    "Este link expirou ou já foi usado. Solicite um novo link de recuperação.",
  WRONG_PASSWORD: "A senha informada não confere.",
  IMPORT_INVALID:
    "Não foi possível ler o extrato. Use OFX ou CSV com as colunas Data, Descrição e Valor. Confira as datas e valores; o limite é de 1.000 lançamentos.",
  INVALID_CARD:
    "Confira o cartão selecionado. Para mudar o cartão ou vencimento de uma compra, exclua o lançamento e cadastre novamente.",
  CARD_NOT_FOUND: "Este cartão não está disponível. Atualize a página.",
  INVALID_AMOUNT: "Informe um valor maior que zero.",
  AMOUNT_TOO_LARGE: "O valor deve ser de até R$ 9.999.999.999,99.",
  INVALID_AMOUNT_DECIMALS: "Informe o valor com no máximo duas casas decimais.",
  INVALID_BUDGET_AMOUNT: "Informe um limite válido, maior ou igual a zero.",
  INVALID_DESCRIPTION: "Preencha a descrição com até 160 caracteres.",
  INVALID_CATEGORY_NAME: "Preencha o nome da categoria com até 50 caracteres.",
  INVALID_DATE: "Escolha uma data válida entre 1900 e 2100.",
  INVALID_PERIOD: "Escolha um mês válido entre 1900 e 2100.",
  INVALID_CATEGORY: "Escolha uma categoria válida ou deixe sem categoria.",
  INVALID_PAYMENT_METHOD: "Escolha uma forma de pagamento válida.",
  INVALID_TRANSACTION_KIND:
    "Escolha se a movimentação é uma receita ou uma despesa.",
  INVALID_TRANSACTION_STATUS:
    "Escolha se a movimentação foi realizada ou está planejada.",
  INVALID_CATEGORY_COLOR: "Escolha uma cor válida para a categoria.",
  INVALID_REPEAT:
    "Escolha uma repetição entre 1 e 24 meses, terminando até dezembro de 2100.",
  INVALID_SEARCH: "Use até 100 caracteres na busca.",
  INVALID_REQUEST: "Confira os campos preenchidos e tente novamente.",
  DUPLICATE_CATEGORY: "Já existe uma categoria com esse nome.",
  CATEGORY_NOT_FOUND:
    "Esta categoria não está mais disponível. Escolha outra ou deixe sem categoria.",
  TRANSACTION_NOT_FOUND:
    "Esta movimentação não está mais disponível. Atualize a página e tente novamente.",
  REQUEST_TOO_LARGE:
    "O conteúdo enviado é muito grande. Reduza o tamanho e tente novamente.",
};

// Only codes in our own catalog become user-facing text. Never display raw
// response.message, exception.message, validator output, HTML or stack traces.
export function userError(
  error: unknown,
  fallback = "Não foi possível concluir agora. Tente novamente em instantes.",
): string {
  if (!(error instanceof AxiosError)) return fallback;
  if (!error.response)
    return "Não foi possível conectar. Verifique sua conexão e tente novamente.";
  const status = error.response.status;
  if (status >= 500) return fallback;
  const code: unknown = error.response.data?.code;
  if (typeof code === "string" && Object.hasOwn(messages, code))
    return messages[code];
  if (status === 400 || status === 422) return messages.INVALID_REQUEST;
  if (status === 401)
    return "Sua sessão expirou. Entre na sua conta novamente.";
  if (status === 403) return "Você não tem permissão para realizar esta ação.";
  if (status === 404)
    return "Este registro não está mais disponível. Atualize a página e tente novamente.";
  if (status === 409)
    return "Já existe um registro com esses dados. Confira e tente novamente.";
  if (status === 413) return messages.REQUEST_TOO_LARGE;
  if (status === 429)
    return "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.";
  return fallback;
}
