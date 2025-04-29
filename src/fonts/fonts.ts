import localFont from "next/font/local";

export const poppins = localFont({
  src: [
    {
      path: "../fonts/en/Poppins-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/en/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/en/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-en",
  display: "swap",
});

export const modamFaNum = localFont({
  src: [
    {
      path: "../fonts/fa/ModamFaNum-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/fa/ModamFaNum-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/fa/ModamFaNum-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fa",
  display: "swap",
});

export function getFontByLocale(locale: string) {
  switch (locale) {
    case "fa":
      return modamFaNum;
    default:
      return poppins;
  }
}
