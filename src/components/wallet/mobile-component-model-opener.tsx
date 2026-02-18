"use client"

import React from "react";
import Glass from "../ui/glass";
import { Button } from "../ui/button";
import Deposit from "./deposit/deposit";
import Withdrawal from "./withdrawal/withdrawal";
import Transfer from "./transfer/transfer";
import { Currency } from "@/types/front/currency";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

type Props = {
    className: string;
    currencies: Currency[] | null;
}
const MobileComponentModalOpener = ({ className, currencies }: Props) => {
    return (
        <div className={className}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full h-fit flex justify-center items-center text-green font-bold text-xl px-0" variant={"ghost"}>
                        <Glass className="w-full h-full rounded-lg bg-green/15 py-3">Deposit</Glass>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Deposit</DialogTitle>
                    </DialogHeader>
                    <Deposit className="" currencies={currencies} />
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full h-fit flex justify-center items-center text-red font-bold text-xl px-0" variant={"ghost"}>
                        <Glass className="w-full h-full rounded-lg bg-red/15 py-3">Withdrawal</Glass>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Withdrawal</DialogTitle>
                    </DialogHeader>
                    <Withdrawal className="" currencies={currencies} />
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full h-fit flex justify-center items-center text-muted font-bold text-xl px-0" variant={"ghost"}>
                        <Glass className="w-full h-full rounded-lg bg-muted/15 py-3">Transfer</Glass>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Transfer</DialogTitle>
                    </DialogHeader>
                    <Transfer className="" currencies={currencies} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MobileComponentModalOpener;
