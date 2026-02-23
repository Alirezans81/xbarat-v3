import React from 'react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image';
import DepositIcon from "../../../../../../public/Wallet/deposit.svg"
import { Card } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"

type deposit = {
    name: string;
} | null;

export default async function Deposit({ deposit }) {
    const t = await getTranslations("Deposit");
    const all_status = [
        { name: "Enter Information" },
        { name: "Admin assign" },
        { name: "Upload Document" },
        { name: "Admin approve" },
        { name: "Accept / Reject" },
    ];
    const currentStep = 0;
    const progressValue = (currentStep / (all_status.length - 1)) * 100;

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <Card className='w-11/12 h-11/12 p-5 flex flex-col bg-transparent border-0'>
                <div className='w-full h-fit flex justify-start flex-row text-green items-center gap-x-3 text-3xl'>
                    <span>{t("deposit")}</span>
                    <Image src={DepositIcon} alt="Deposit Icon" width={28} height={28} className='w-7 h-7' />
                </div>


                {/* Top Stepper */}
                <div className='w-full mt-8'>
                    <div
                        className='flex flex-row justify-between m-2'
                    >
                        {all_status.map((status, index) => (
                            <span
                                key={status.name}
                                className={`w-fit flex justify-center text-center text-xs leading-tight ${index === currentStep ? 'text-white font-medium' : 'text-white/80'}`}
                            >
                                {status.name}
                            </span>
                        ))}
                    </div>

                    <div className='w-full relative p-0'>
                        <Progress
                            value={progressValue}
                            className='w-full absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-muted  **:data-[slot=progress-indicator]:bg-white'
                        />
                        <div className='w-full relative z-10 flex items-center justify-between'>
                            {all_status.map((status, index) => {
                                return (
                                    <div
                                        key={`${status.name}-${index}`}
                                        className={`h-3 w-3 rounded-full bg-white flex items-center justify-center`}
                                    />

                                );
                            })}
                        </div>
                    </div>
                </div>


                {/* Different Status */}


                {/* Enter Information, Create Deposit */}
                <div className={currentStep !== 0 ? "hidden" : 'w-full h-full flex flex-col'}>

                </div>

                {/* Enter Information, Create Deposit */}
                <div className={currentStep !== 0 ? "hidden" : 'w-full h-full flex flex-col'}>

                </div>

                {/* Enter Information, Create Deposit */}
                <div className={currentStep !== 0 ? "hidden" : 'w-full h-full flex flex-col'}>

                </div>

                {/* Enter Information, Create Deposit */}
                <div className={currentStep !== 0 ? "hidden" : 'w-full h-full flex flex-col'}>

                </div>


                {/* Enter Information, Create Deposit */}
                <div className={currentStep !== 0 ? "hidden" : 'w-full h-full flex flex-col'}>

                </div>


            </Card>

        </div>
    )
}
