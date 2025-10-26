"use client";

import { useRef, useState } from "react";
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
import { useUploadLiquidityPoolDocument } from "@/api/liquidity-pool/hook";
import Image from "next/image";
import { Upload } from "lucide-react";

interface Props {
  liquidityPool_id: string;
}
export default function UploadLiquidityPoolDocument({
  liquidityPool_id,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const documentRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<File | undefined>(undefined);
  const [DocumentError, setDocumentError] = useState("");
  const validateDocument = (value: File | undefined) => {
    if (!value) {
      setDocumentError("Document required!");
      return false;
    }

    return true;
  };

  const uploadLiquidityPoolDocument = useUploadLiquidityPoolDocument();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateDocument(document) && document) {
      setLoading(true);
      uploadLiquidityPoolDocument({
        liquidityPool_id,
        document,
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
          <Button className="text-white">Upload Document</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              ref={documentRef}
              className="hidden"
              name="document"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setDocument(
                  e.target.files?.length ? e.target.files[0] : undefined
                )
              }
              required
            />

            <div className="w-full relative">
              {document ? (
                <Image
                  alt="Uploaded Document"
                  src={URL.createObjectURL(document)}
                  className="w-full opacity-100 bg-accent rounded-2xl"
                  width={512}
                  height={512}
                />
              ) : (
                <div className="w-full h-40 bg-accent opacity-70 rounded-2xl" />
              )}
              <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
                <button
                  className="p-5 rounded-xl bg-background cursor-pointer border-4 border-accent-foreground/50 shadow"
                  onClick={() => documentRef.current?.click()}
                >
                  <Upload />
                </button>
              </div>
            </div>
            {DocumentError && (
              <span className="block text-sm mt-2 text-chart-5">
                {DocumentError}
              </span>
            )}
          </div>
          <div className="mt-4 !z-40">
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
