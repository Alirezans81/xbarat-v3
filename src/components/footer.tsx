import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Image from "next/image";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="w-full bg-card">
      <div className="container mx-auto pb-4 pt-6 px-5">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full grid grid-cols-4 gap-y-6 sm:gap-y-0 mb-8">
            <div className="col-span-4 sm:col-span-1 grid grid-cols-2 gap-2 sm:gap-0 lg:gap-3 items-center sm:items-start">
              <div className="col-span-2 flex justify-center sm:justify-start items-center gap-1 mb-2">
                <Image
                  width={512}
                  height={512}
                  alt=""
                  className="w-10 h-10"
                  src="/logo.png"
                />
                <span className="text-2xl text-secondary">{t("xbarat")}</span>
              </div>
              <span className="col-span-2 font-semibold mx-auto sm:mx-0 sm:-mt-5 lg:-mt-0">
                {t("slogan") + " 🤝"}
              </span>
              <span className="col-span-2 text-center sm:text-start text-muted-foreground transition-all duration-300 hover:text-foreground text-sm sm:-mt-5 lg:-mt-0">
                +98 3514 4234
              </span>
              <span className="col-span-2 text-center sm:text-start text-muted-foreground transition-all duration-300 hover:text-foreground text-sm sm:-mt-5 lg:-mt-0">
                xbarat.team@gmail.com
              </span>
            </div>
            <div className="col-span-4 block sm:hidden h-0.25 rounded-full bg-muted-foreground/30" />

            <div className="col-span-2 sm:col-span-1 flex sm:ps-5">
              <div className="flex flex-col gap-2.5 mx-auto items-center sm:mx-0 sm:items-start">
                <span className="text-sm mb-1.5 font-semibold">Pages</span>
                <Link
                  href="/"
                  className="text-muted-foreground transition-all duration-300 hover:text-foreground text-sm "
                >
                  Home
                </Link>
                <Link
                  href="/"
                  className="text-muted-foreground transition-all duration-300 hover:text-foreground text-sm "
                >
                  Wallet
                </Link>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex">
              <div className="flex flex-col gap-2.5 mx-auto items-center sm:mx-0 sm:items-start">
                <span className="text-sm mb-1.5 font-semibold">Services</span>
                <Link
                  href="/"
                  className="text-muted-foreground transition-all duration-300 hover:text-foreground text-sm "
                >
                  Blog
                </Link>
                <Link
                  href="/"
                  className="text-muted-foreground transition-all duration-300 hover:text-foreground text-sm "
                >
                  Xbarat v2
                </Link>
                <Link
                  href="/"
                  className="text-muted-foreground transition-all duration-300 hover:text-foreground text-sm "
                >
                  API
                </Link>
              </div>
            </div>
            <div className="col-span-4 block sm:hidden h-0.25 rounded-full bg-muted-foreground/30" />

            <div className="col-span-4 sm:col-span-1 flex flex-col items-center sm:items-start gap-4">
              <span className="text-xl font-semibold">Newsletter</span>
              <span className="text-muted-foreground text-sm text-center sm:text-start">
                Subscribe our newsletter to get more free design course and
                resource.
              </span>
              <div className="flex flex-col lg:flex-row gap-2">
                <Input disabled placeholder="Enter your email" />
                <Button disabled className="text-white">
                  Coming Soon...
                </Button>
              </div>
              <div className="flex gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href="/">
                        <Image
                          width={20}
                          height={20}
                          alt=""
                          src="/SocialMedia/instagram.svg"
                          className="size-5"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-foreground">{t("instagram")}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href="/">
                        <Image
                          width={20}
                          height={20}
                          alt=""
                          src="/SocialMedia/whatsapp.svg"
                          className="size-5"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-foreground">{t("whatsApp")}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href="/">
                        <Image
                          width={20}
                          height={20}
                          alt=""
                          src="/SocialMedia/telegram.svg"
                          className="size-5"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-foreground">{t("telegram")}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href="/">
                        <div className="p-1.5 rounded-full bg-black">
                          <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/SocialMedia/x.svg"
                            className="size-2.5"
                          />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-foreground">{t("x")}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <div className="w-full h-0.25 rounded-full bg-muted-foreground/30" />
          <span className="text-sm text-muted-foreground mx-auto">
            Copyright © 2025 xbarat.com
          </span>
        </div>
      </div>
    </footer>
  );
}
