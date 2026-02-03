import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import LocaleToggle from "./locale-toggle";
import NavbarButton from "./navbar/navbar-action-button";
import { SidebarTrigger } from "./ui/sidebar";
import Image from "next/image";

export default async function Navbar() {
  const t = await getTranslations("Navbar");

  return (
    <header className="w-full bg-transparent backdrop-blur-2xl shadow-lg shadow-muted-foreground/10 dark:shadow-secondary/10 transition-all duration-300 hover:shadow-none">
      <nav className="container mx-auto py-3 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="sm:hidden flex justify-center items-center">
            <SidebarTrigger size="icon" className="" />
          </div>
          <Link href="/" className="flex items-center gap-1">
            <Image alt="" className="w-10 h-10" src="/logo.png" />
            <span className="text-2xl text-secondary">{t("xbarat")}</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="sm:block hidden">
            <ThemeToggle />
          </div>
          <div className="sm:block hidden">
            <LocaleToggle />
          </div>
          <NavbarButton />
        </div>
      </nav>
    </header>
  );
}
