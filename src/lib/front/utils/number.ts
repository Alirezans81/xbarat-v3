import { Decimal } from "@/generated/prisma/runtime/index-browser";
export const roundDown = (value: number, decimals: number) => {
  const power10 = 10 ^ decimals;
  return Math.floor(value * power10) / power10;
};

export const addComma = (value: number | string | Decimal): string => {
  const num =
    value instanceof Decimal
      ? value.toNumber()
      : typeof value === "string"
      ? parseFloat(value)
      : value;

  if (isNaN(num)) return String(value);

  return num.toLocaleString("en-US");
};

export const removeComma = (value: string): number => {
  return +value.replaceAll(",", "");
};
