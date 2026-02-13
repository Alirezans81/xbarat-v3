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
import { Input } from "../../../ui/input";

export default function AddTransferDialog() {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const [code, setCode] = useState("");
  const [CodeError, setCodeError] = useState("");
  const validateCode = (value: string) => {
    if (!value) {
      setCodeError("Code required!");
      return false;
    }

    return true;
  };

  const [symbol, setSymbol] = useState("");
  const [SymbolError, setSymbolError] = useState("");
  const validateSymbol = (value: string) => {
    if (!value) {
      setSymbolError("Symbol required!");
      return false;
    }

    return true;
  };

  const [decimals, setDecimals] = useState(0);
  const [DecimalsError, setDecimalsError] = useState("");
  const validateDecimals = (value: string) => {
    if (!value) {
      setDecimalsError("Decimals required!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <div>
          <Button className="text-foreground ">New Transfer</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="">Add Currency</DialogTitle>
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
            <Input
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={(e) => validateCode(e.target.value)}
              required
            />
            {CodeError && (
              <span className="block text-sm mt-2 text-chart-5">
                {CodeError}
              </span>
            )}
          </div>
          <div>
            <Input
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onBlur={(e) => validateSymbol(e.target.value)}
              required
            />
            {SymbolError && (
              <span className="block text-sm mt-2 text-chart-5">
                {SymbolError}
              </span>
            )}
          </div>
          <div>
            <Input
              type="number"
              placeholder="Decimals"
              value={decimals}
              onChange={(e) => setDecimals(+e.target.value)}
              onBlur={(e) => validateDecimals(e.target.value)}
              required
            />
            {DecimalsError && (
              <span className="block text-sm mt-2 text-chart-5">
                {DecimalsError}
              </span>
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
