"use client";

import { useState } from "react";
import Glass from "@/components/ui/glass";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Deactivate from "../../../../public/Profile/Deactivate.svg";
import Delete from "../../../../public/Profile/delete.svg";
import Default from "../../../../public/Profile/Default.svg";
import Image from "next/image";
type EditCardDialogProps = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDeactivate: () => void;
  onSetDefault: () => void;
};

export default function EditCardDialog({
  open,
  onClose,
  onDelete,
  onDeactivate,
  onSetDefault,
}: EditCardDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Glass className="rounded-xl w-full max-w-sm">
        <Card className="px-6 py-5 flex flex-col gap-4">
          <span className="text-lg font-semibold">Edit Card</span>

          <div className="flex flex-col gap-3">
            <Button
              variant="ghost"
              className="w-full h-fit flex flex-row justify-start"
              onClick={onDeactivate}
            >
              <Image
                src={Deactivate}
                alt="Deactivate"
                className="w-4 h-4"
                width={16}
                height={16}
              />
              Deactivate
            </Button>

            <Button
              variant="ghost"
              className="w-full h-fit flex flex-row justify-start"
              onClick={onSetDefault}
            >
              <Image
                src={Default}
                alt="Default"
                className="w-4 h-4"
                width={16}
                height={16}
              />
              Default
            </Button>

            <Button
              variant="ghost"
              className="w-full h-fit flex flex-row justify-start"
              onClick={onDelete}
            >
              <Image
                src={Delete}
                alt="Delete"
                className="w-4 h-4"
                width={16}
                height={16}
              />
              Delete
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Card>
      </Glass>
    </div>
  );
}
