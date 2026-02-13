"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useRouter } from "@/i18n/navigation";
import { useCreatePaymentChannel } from "@/api/payment-channel/hook";
import { Textarea } from "@/components/ui/textarea";

export default function AddPaymentChannelDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [NameError, setNameError] = useState("");
  const validateName = (value: string) => {
    if (!value) {
      setNameError("Name required!");
      return false;
    }

    return true;
  };

  const [description, setDescription] = useState("");

  const createPaymentChannel = useCreatePaymentChannel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateName(name)) {
      setLoading(true);
      createPaymentChannel({
        paymentChannel: {
          name,
          description,
        },
        onSuccess() {
          setOpen(false);
          router.refresh();
        },
        onFinally() {
          setLoading(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <div>
          <Button className="text-white">+ Add</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="">Add Payment Channel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => validateName(e.target.value)}
              required
            />
            {NameError && (
              <span className="block text-sm mt-2 text-chart-5">
                {NameError}
              </span>
            )}
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full text-foreground "
              disabled={loading}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
