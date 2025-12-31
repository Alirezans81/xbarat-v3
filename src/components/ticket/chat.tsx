"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { TicketMessage } from "@/types/front/ticket";
import { SendHorizonal } from "lucide-react";
import Message from "./chat/message";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTicketMessage } from "@/api/ticket/hook";
import { useRouter } from "@/i18n/navigation";

const formSchema = z.object({
  message: z.string(),
});

interface Props {
  ticket_id: string;
  messages: TicketMessage[];
}
export default function Chat({ ticket_id, messages }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createTicketMessage = useCreateTicketMessage();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("ticketId", ticket_id);
    formData.append("message", values.message);

    createTicketMessage({
      formData,
      onSuccess() {
        form.reset();
        router.refresh();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto px-2">
          {messages.map((message) => (
            <Message key={message.id} data={message} />
          ))}
        </div>
        <FormField
          name="message"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputGroup className="h-12 px-1">
                  <InputGroupInput
                    placeholder="Type your message..."
                    className="!text-lg"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="link" type="submit">
                      <SendHorizonal className="!w-6 !h-6" />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
