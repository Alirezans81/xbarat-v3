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
import { useCreateFeeUser } from "@/api/fee-user/hook";

export default function AddFeeUserDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("User Email required!");
      return false;
    }

    return true;
  };

  const createFeeUser = useCreateFeeUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateEmail(email)) {
      setLoading(true);
      createFeeUser({
        feeUser: {
          email,
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
          <DialogTitle className="">Add Fee User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              placeholder="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => validateEmail(e.target.value)}
              required
            />
            {emailError && (
              <span className="text-red-500 text-sm">{emailError}</span>
            )}
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
