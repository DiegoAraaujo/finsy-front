import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Providers from "./providers";
const montserrat = localFont({
  src: "../assets/fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "Finsy — suas finanças com clareza",
    template: "%s | Finsy",
  },
  description:
    "Organize seus gastos, acompanhe vencimentos e planeje seu mês com o Finsy.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body
        className={cn(
          "finance-body m-0 bg-[#f4f5f8] font-sans text-[#262e3f] [font-synthesis:none] motion-reduce:[:where(&)_*]:animate-none! motion-reduce:[:where(&)_*]:[scroll-behavior:auto]! motion-reduce:[:where(&)_*]:[transition:none]! motion-reduce:[:where(&)_*::after]:animate-none! motion-reduce:[:where(&)_*::after]:[scroll-behavior:auto]! motion-reduce:[:where(&)_*::after]:[transition:none]! motion-reduce:[:where(&)_*::before]:animate-none! motion-reduce:[:where(&)_*::before]:[scroll-behavior:auto]! motion-reduce:[:where(&)_*::before]:[transition:none]! [:where(&)_:focus-visible]:[outline:3px_solid_#9ca6bb] [:where(&)_:focus-visible]:[outline-offset:4px] [:where(&)_button]:cursor-pointer [:where(&)_button]:[font:inherit] [:where(&)_button:disabled]:cursor-wait [:where(&)_button:disabled]:opacity-55 [:where(&)_input]:[font:inherit] [:where(&)_select]:[font:inherit]",
          "[&_input[type=number]]:[-moz-appearance:textfield] [&_input[type=number]::-webkit-inner-spin-button]:m-0 [&_input[type=number]::-webkit-inner-spin-button]:[-webkit-appearance:none] [&_input[type=number]::-webkit-outer-spin-button]:m-0 [&_input[type=number]::-webkit-outer-spin-button]:[-webkit-appearance:none]",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
