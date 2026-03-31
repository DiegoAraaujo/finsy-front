export const formatMonthYear = (month: number, year: number): string => {
  const date = new Date(year, month - 1);

  const monthName = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(date);

  const capitalizedMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return `${capitalizedMonth} de ${year}`;
};
