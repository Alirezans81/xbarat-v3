import { getTickets } from "@/api/ticket/action";
import TicketFilters from "@/components/ticket/ticket-filters";
import TicketsTable from "@/components/ticket/tickets-table";
import { TicketStatus } from "@/generated/prisma";
import { Link } from "@/i18n/navigation";
import { GetTicketsFilters } from "@/types/back/ticket";
import { ChevronLeft } from "lucide-react";

export default async function page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  try {
    const status = (await searchParams)?.status as TicketStatus;

    const filters: GetTicketsFilters = {
      ...(status && { status }),
    };
    const data = await getTickets(filters);

    return (
      <div className="w-full">
        <div className="container mx-auto px-5 py-8 flex flex-col gap-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Link href="/panel-admin">
                <ChevronLeft />
              </Link>
              <span className="text-3xl">Tickets</span>
            </div>

            <TicketFilters default_ticket_status={status} />
          </div>

          <TicketsTable data={data} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("[CURRENCY_PAGE]", error);
    return (
      <div className="w-full h-full flex justify-center items-center">
        Internal server error
      </div>
    );
  }
}
