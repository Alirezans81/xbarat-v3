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
import { Input } from "../../../ui/input";
import { useRouter } from "@/i18n/navigation";
import {
  useGetMatchedDepositBridgeTransfers,
  useUploadDepositDocument,
} from "@/api/wallet/deposit/hook";
import { BridgeTransfer } from "@/types/front/bridgeTransfer";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  deposit_id: string;
}

export default function UploadDepositDocument({ deposit_id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<Record<string, File | undefined>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (id: string, file?: File) => {
    setDocuments((prev) => ({ ...prev, [id]: file }));
    setErrors((prev) => ({ ...prev, [id]: file ? "" : "Document required!" }));
  };

  const validate = (transfers: BridgeTransfer[]) => {
    let ok = true;
    const newErrors: Record<string, string> = {};

    transfers.forEach((t) => {
      if (!documents[t.id]) {
        newErrors[t.id] = "Document required!";
        ok = false;
      }
    });

    setErrors(newErrors);
    return ok;
  };

  const [matchedBridgeTransfers, setMatchedBridgeTransfers] = useState<
    BridgeTransfer[]
  >([]);
  const [matchedBridgeTransfersLoading, setMatchedBridgeTransfersLoading] =
    useState(false);
  const getMatchedDepositBridgeTransfers = useGetMatchedDepositBridgeTransfers();

  useEffect(() => {
    if (open) {
      setMatchedBridgeTransfersLoading(true);
      getMatchedDepositBridgeTransfers({
        deposit_id,
        setMatchedBridgeTransfers,
        onFinally() {
          setMatchedBridgeTransfersLoading(false);
        },
      });
    }
  }, [open]);

  const uploadDepositDocument = useUploadDepositDocument();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate(matchedBridgeTransfers)) return;

    setLoading(true);

    const data: { documents: { bridgeTransferId: string; document: File }[] } =
      { documents: [] };
    matchedBridgeTransfers.forEach((transfer, index) => {
      data.documents.push({
        bridgeTransferId: transfer.id,
        document: documents[transfer.id]!,
      });
    });

    uploadDepositDocument({
      deposit_id,
      data,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button className="text-white">Upload Documents</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-3">
            {matchedBridgeTransfersLoading && (
              <div className="p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
                Getting matched transfers... Please wait{" "}
                <Spinner className="inline ms-0.5" />
              </div>
            )}

            {!matchedBridgeTransfersLoading &&
              matchedBridgeTransfers.length > 0 && (
                <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-800/50 dark:text-green-400">
                  We found {matchedBridgeTransfers.length} matching transfer(s).
                </div>
              )}

            {!matchedBridgeTransfersLoading &&
              matchedBridgeTransfers.length === 0 && (
                <div className="p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-800/50 dark:text-yellow-200">
                  No matching bridge transfers found.
                </div>
              )}

            {!matchedBridgeTransfersLoading &&
              matchedBridgeTransfers.length > 0 && (
                <span className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:text-gray-200">
                  Upload the required document for each transfer.
                </span>
              )}

            {!matchedBridgeTransfersLoading &&
              matchedBridgeTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="p-4 border rounded-xl mb-4 bg-accent/10 flex flex-col gap-3"
                >
                  {transfer.withdrawal && (
                    <>
                      <div className="w-full flex justify-between items-center">
                        <span>Amount:</span>{" "}
                        {transfer.deposit?.wallet.currency.symbol +
                          " " +
                          (+transfer.amount).toLocaleString()}
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <span>Address:</span>{" "}
                        {transfer.withdrawal?.receiverAddress}
                      </div>
                    </>
                  )}
                  {transfer.liquidityPool && (
                    <>
                      <div className="w-full flex justify-between items-center">
                        <span>Amount:</span>{" "}
                        {transfer.deposit?.wallet.currency.symbol +
                          " " +
                          (+transfer.amount).toLocaleString()}
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <span>Address:</span> {transfer.liquidityPool.address}
                      </div>
                    </>
                  )}

                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      className={`transition-all duration-200 ${
                        documents[transfer.id]
                          ? "rounded-b-none border-b-0"
                          : ""
                      }`}
                      onChange={(e) =>
                        handleFileChange(
                          transfer.id,
                          e.target.files?.length ? e.target.files[0] : undefined
                        )
                      }
                    />
                    {documents[transfer.id] && (
                      <img
                        src={URL.createObjectURL(documents[transfer.id]!)}
                        className="rounded-lg rounded-t-none mx-auto w-full max-h-52 object-cover border border-input"
                        width={200}
                        height={200}
                      />
                    )}
                  </div>

                  {errors[transfer.id] && (
                    <span className="text-red-500 text-sm">
                      {errors[transfer.id]}
                    </span>
                  )}
                </div>
              ))}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full text-white"
              disabled={loading || matchedBridgeTransfersLoading}
            >
              Submit All
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
