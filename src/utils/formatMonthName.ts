export const formatMonthYear = (month: number, year: number): string => {
  const date = new Date(year, month - 1);

  const monthName = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(date);

  const capitalizedMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return `${capitalizedMonth} de ${year}`;
};

export const formatFullDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR").format(d);
};
