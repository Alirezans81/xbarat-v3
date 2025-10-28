"use client";

import { useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { useApproveLiquidityPoolDocument } from "@/api/liquidity-pool/hook";
import Image from "next/image";

interface Props {
  liquidityPool_id: string;
  document_url: string;
}
export default function ApproveLiquidityPoolDocument({
  liquidityPool_id,
  document_url,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const approveLiquidityPoolDocument = useApproveLiquidityPoolDocument();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    approveLiquidityPoolDocument({
      liquidityPool_id,
      onSuccess() {
        setOpen(false);
        router.refresh();
      },
      onFinally() {
        setLoading(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <div>
          <Button className="text-white">Approve Document</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Approve Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <img
              alt="Uploaded Document"
              src={document_url}
              className="w-full opacity-100 bg-accent rounded-2xl"
              width={512}
              height={512}
            />
          </div>
          <div className="mt-4 !z-40">
            <Button
              type="submit"
              className="w-full text-white cursor-pointer"
              disabled={loading}
            >
              Approve
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
