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
import Image from "next/image";

interface Props {
  deposit_id: string;
}
export default function UploadDepositDocument({ deposit_id }: Props) {
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

        <img />
      </DialogContent>
    </Dialog>
  );
}
