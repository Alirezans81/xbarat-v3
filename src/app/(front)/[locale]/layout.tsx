import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getFontByLocale } from "@/fonts/fonts";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import HandleCookies from "@/components/handle-cookies";
import { rtlLocales } from "@/lib/front/constants";

export const metadata: Metadata = {
  title: "Xbarat | Exchange/Transfer Fiat Money",
  description: "Exchange/Transfer Fiat Money",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const font = getFontByLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning className={font.variable}>
      <body
        dir={rtlLocales.includes(locale) ? "rtl" : "ltr"}
        className="font-sans"
        style={font.style}
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <HandleCookies />
            <SidebarProvider defaultOpen={false}>
              <AppSidebar
                side={rtlLocales.includes(locale) ? "right" : "left"}
              />
              <div className="w-full bg-background">
                <div
                  className="w-full h-full flex flex-col"
                  style={{
                    backgroundImage: "url('/background.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Navbar />
                  <main className="flex-1 w-full h-full">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
