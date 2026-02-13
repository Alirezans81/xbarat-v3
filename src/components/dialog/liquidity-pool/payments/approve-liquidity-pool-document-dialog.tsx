"use client";

import { useEffect, useState } from "react";
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
  documents: {
    bridgeTransferId: string;
    amount: number;
    documentUrl: string;
  }[];
}
export default function ApproveLiquidityPoolDocument({
  liquidityPool_id,
  documents,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isApprovedDocuments, setIsApprovedDocuments] = useState<boolean[]>(
    documents.map(() => false)
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsApprovedDocuments(documents.map(() => false));
  }, [documents]);

  const handleToggleApprove = (index: number, value: boolean) => {
    setIsApprovedDocuments((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const approveLiquidityPoolDocument = useApproveLiquidityPoolDocument();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    approveLiquidityPoolDocument({
      liquidityPool_id,
      approvedBridgeTransfers: documents
        .map((doc, index) =>
          isApprovedDocuments[index] ? doc.bridgeTransferId : null
        )
        .filter((id): id is string => id !== null),
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
          <Button className="text-white">Approve Documents</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Approve Documents</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <span className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:text-gray-200">
            Approve the documents ones that are valid.
          </span>
          {documents.map((document, index) => (
            <div
              key={document.bridgeTransferId}
              className="flex flex-col border border-input rounded-lg overflow-hidden"
            >
              <div className="w-full flex justify-between items-center px-4 py-3 bg-accent rounded-none">
                <span>Amount:</span>
                <span>{(+document.amount).toLocaleString()}</span>
              </div>
              <Image
                alt="Uploaded Document"
                src={document.documentUrl}
                unoptimized
                className="w-full opacity-100 bg-accent/50"
                width={512}
                height={512}
              />
              <div className="flex">
                <Button
                  variant="destructive"
                  className={`flex-1 !rounded-none border-none ${
                    isApprovedDocuments[index]
                      ? "!bg-destructive/40 !text-foreground/40"
                      : ""
                  }`}
                  type="button"
                  onClick={() => handleToggleApprove(index, false)}
                >
                  Not Approved
                </Button>
                <Button
                  variant="default"
                  className={`flex-1 !rounded-none border-none ${
                    !isApprovedDocuments[index]
                      ? "!bg-primary/40 !text-foreground/40"
                      : ""
                  }`}
                  type="button"
                  onClick={() => handleToggleApprove(index, true)}
                >
                  Approved
                </Button>
              </div>
            </div>
          ))}
          <div className="mt-1 !z-40">
            <Button
              type="submit"
              className="w-full text-white cursor-pointer"
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
