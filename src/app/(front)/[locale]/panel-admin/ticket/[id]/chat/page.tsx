import { getTicketMessages } from "@/api/ticket/action";
import Chat from "@/components/dialog/ticket/chat";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";

export default async function page({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  try {
    const { id } = await params;

    const messages = await getTicketMessages(id);

    return (
      <div className="w-full p-7">
        <div className="container mx-auto p-5 flex flex-col gap-4 bg-card rounded-2xl">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Link href="/panel-admin/ticket">
                <ChevronLeft />
              </Link>
              <span className="text-3xl">Ticket ({id})</span>
            </div>
          </div>

          <Chat messages={messages} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("[TICKET_CHAT_PAGE]", error);
    return (
      <div className="w-full h-full flex justify-center items-center">
        Internal server error
      </div>
    );
  }
}
