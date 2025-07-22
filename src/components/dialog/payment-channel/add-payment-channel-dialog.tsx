"use client";

import { useEffect, useRef, useState } from "react";
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
import { Upload } from "lucide-react";
import { useCreatePaymentChannel } from "@/api/payment-channel/hook";
import { Currency } from "@/types/front/currency";
import { useGetCurrencies } from "@/api/currency/hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Props {}
export default function AddPaymentChannelDialog({}: Props) {
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
  const [DescriptionError, setDescriptionError] = useState("");
  const validateDescription = (value: string) => {
    return true;
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [LogoError, setLogoError] = useState("");
  const validateLogo = (value: File | null) => {
    if (!value) {
      setLogoError("Logo required!");
      return false;
    }

    return true;
  };

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
              onBlur={(e) => validateDescription(e.target.value)}
            />
            {DescriptionError && (
              <span className="block text-sm mt-2 text-chart-5">
                {DescriptionError}
              </span>
            )}
          </div>

          {/* <div>
            <Input
              ref={logoInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              placeholder="Logo"
              value={description}
              onChange={(e) => {
                if (e.target.files?.length) {
                  setLogo(e.target.files[0]);
                  setLogoUrl(URL.createObjectURL(e.target.files[0]));
                }
              }}
              onBlur={(e) =>
                validateLogo(e.target.files?.length ? e.target.files[0] : null)
              }
              required
            />
            <div className="w-full bg-card border border-input rounded-lg py-[30%] flex justify-center relative">
              <img
                className={`absolute w-full h-full top-0 left-0 rounded-lg opacity-60 z-0 object-contain p-5 ${
                  logoUrl ? "block" : "hidden"
                }`}
                src={logoUrl}
              />
              <Button
                type="button"
                variant="outline"
                className="text-foreground  z-10 !bg-background"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload />
                Upload Logo
              </Button>
            </div>
            {LogoError && (
              <span className="block text-sm mt-2 text-chart-5">
                {LogoError}
              </span>
            )}
          </div> */}
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
