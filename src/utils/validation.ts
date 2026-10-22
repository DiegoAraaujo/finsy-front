export const commonPasswords = [
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "87654321",
  "qwerty123",
  "qwertyuiop",
  "senha123",
  "senha1234",
  "admin123",
  "admin1234",
  "iloveyou",
  "letmein1",
  "welcome1",
  "finsy123",
  "finsy1234",
];
export function isCommonPassword(value: string) {
  const normalized = value.normalize("NFKC").trim().toLowerCase();
  return (
    commonPasswords.includes(normalized) ||
    /^(.)\1{7,}$/u.test(normalized) ||
    (normalized.length >= 8 &&
      [
        "01234567890123456789",
        "abcdefghijklmnopqrstuvwxyz",
        "zyxwvutsrqponmlkjihgfedcba",
      ].some((sequence) => sequence.includes(normalized)))
  );
}

// Keep these input rules aligned with the API schemas; contract tests cover boundaries.
export const MAX_MONEY = 9999999999.99;
export function textError(value: string, label: string, max: number) {
  return !value.trim() || value.trim().length > max
    ? `Preencha ${label} com até ${max} caracteres.`
    : undefined;
}
export function moneyError(value: number, allowZero = false) {
  if (!Number.isFinite(value) || value < 0 || (!allowZero && value === 0))
    return allowZero
      ? "Informe um valor maior ou igual a zero."
      : "Informe um valor maior que zero.";
  if (value > MAX_MONEY) return "O valor deve ser de até R$ 9.999.999.999,99.";
  if (Math.abs(value * 100 - Math.round(value * 100)) >= 0.001)
    return "Use até duas casas decimais.";
}
export function dateError(
  value: string,
  min = "1900-01-01",
  max = "2100-12-31",
) {
  const date = new Date(`${value}T00:00:00Z`);
  return !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value ||
    value < min ||
    value > max
    ? "Escolha uma data válida dentro do período permitido."
    : undefined;
}
export function emailError(value: string) {
  const normalized = value.trim().toLowerCase();
  const email =
    /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+.-]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;
  return normalized.length > 254 || !email.test(normalized)
    ? "Informe um e-mail válido com até 254 caracteres."
    : undefined;
}
export function passwordError(value: string, newPassword = false) {
  if (newPassword && isCommonPassword(value))
    return "Escolha uma senha menos comum. Evite sequ\u00eancias e repeti\u00e7\u00f5es.";
  return value.length < (newPassword ? 8 : 1) ||
    value.length > 72 ||
    new TextEncoder().encode(value).length > 72
    ? newPassword
      ? "Use pelo menos 8 caracteres e evite senhas muito longas."
      : "Informe sua senha e evite senhas muito longas."
    : undefined;
}
export function dayError(day: number) {
  return !Number.isInteger(day) || day < 1 || day > 31
    ? "Escolha um dia entre 1 e 31."
    : undefined;
}
