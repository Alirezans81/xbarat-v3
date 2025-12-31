import { TicketMessage } from "@/types/front/ticket";

interface Props {
  data: TicketMessage;
}
export default function Message({ data }: Props) {
  const sentByAdmin =
    data.senderRole === "ADMIN" || data.senderRole === "SUPPORT";

  return (
    <div
      className={`flex items-center justify-between ${
        sentByAdmin ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`${
          sentByAdmin ? "bg-input" : "bg-accent"
        } rounded-e-2xl rounded-bl-2xl px-5 py-3`}
      >
        {data.message}
      </div>
      <span className="text-sm text-muted-foreground">
        {new Date().getDate() === new Date(data.createdAt).getDate()
          ? "Today"
          : new Date(data.createdAt).toDateString() +
            " " +
            new Date(data.createdAt).toTimeString().split(" ")[0]}
      </span>
    </div>
  );
}
