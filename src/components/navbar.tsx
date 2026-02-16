import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import LocaleToggle from "./locale-toggle";
import NavbarButton from "./navbar/navbar-action-button";
import Image from "next/image";
import SidebarButton from "./sidebar-button";
import TopbarMenu from "./topbar-menu";

export default async function Navbar() {
  const t = await getTranslations("Navbar");

  return (
    <header className="w-full bg-card/50 sticky backdrop-blur-2xl shadow-lg shadow-muted-foreground/10 dark:shadow-secondary/10 transition-all duration-300 hover:shadow-none border-b">
      <nav className="container mx-auto py-3 px-5 flex gap-10 items-center">
        <div className="flex-1 lg:flex-none flex items-center gap-3">
          <SidebarButton />
          <Link href="/" className="flex items-center gap-1">
            <Image
              width={512}
              height={512}
              alt=""
              className="w-10 h-10"
              src="/logo.png"
            />
            <span className="text-2xl text-secondary">{t("xbarat")}</span>
          </Link>
        </div>
        <div className="hidden sm:block mx-auto md:!mx-0">
          <TopbarMenu />
        </div>
        <div className="flex-1 lg:flex-none flex items-center gap-2 ms-auto justify-end">
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
