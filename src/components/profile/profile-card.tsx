"use client"

import { cn } from "@/lib/front/utils/tailwind"
import { Card } from "../ui/card"
import Glass from "../ui/glass"
import Image from "next/image"
import Camera from "../../../public/Profile/Camera.svg";
import Edit from "../../../public/Profile/Edit.svg";
import Document from "../../../public/Profile/Photo.svg"
import UserProfileCircle from "../../../public/User_cicrle_duotone.png"
import { Input } from "../ui/input";
import { useAuthStore } from "@/lib/front/stores/auth";
import { useState } from "react";
import { User } from "@/generated/prisma";

type Props = {
    className?: string
}

export default function ProfileCard({ className }: Props) {
    const { user, setUser } = useAuthStore();
    const [editing, setEditing] = useState<string>("");
    const [tempVariable, setTempVariable] = useState<Date | boolean | string | null>("");

    function handleEdit(val: keyof User) {
        setEditing(val);
        user && setTempVariable(user !== null ? user[val] : "");

    }

    function handleBlur(val: keyof User) {
        setEditing("");
        setTempVariable("");
        /*Patch the data*/
    }

    return (
        <section
            className={cn(className)}
        >
            <Glass>
                <Card className="w-full h-full flex flex-col items-center px-3">

                    {/* Profile Photo and Edit */}
                    <div className='w-fit h-fit relative bg-transparent'>
                        {/* Profile Photo */}
                        <Image
                            src={UserProfileCircle}
                            width={120}
                            height={120}
                            alt='user photo'
                            className='w-30 h-30 rounded-full object-cover'
                        />

                        {/* Upload Icon - positioned at bottom-right */}
                        <div className='absolute bottom-2 right-2 z-10 rounded-full'>
                            <Image
                                src={Camera}
                                width={28}
                                height={28}
                                alt='icon for user upload photo'
                                className='w-7 h-7'
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="w-fit h-fit flex flex-row items-center gap-x-3">
                        <Image
                            src={Edit}
                            width={16}
                            height={16}
                            alt="icon for user edit name"
                            className="w-4 h-4" />
                        <span>Mohammad Hemmatian</span>
                    </div>


                    {/* Grid for user specs */}
                    <div className="grid grid-rows-4 grid-cols-12 p-2 gap-2">

                        {/* First Row */}
                        <div className="col-span-6 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context">
                            <span>Email</span>
                            <span className="w-full px-2 overflow-x-auto whitespace-nowrap text-center text-sm">mohammadhemmatain8273@gmail.com</span>
                        </div>

                        <div className="col-span-6 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context">
                            <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                                <span>Phone Number</span>
                                <Image
                                    src={Edit}
                                    width={16}
                                    height={16}
                                    alt="icon for user edit name"
                                    className="w-4 h-4" />
                            </div>
                            {editing === "phoneNumber" ? < Input className="text-foreground" value={"+989907271262"} /> : <span className="text-foreground" >{"+989907271262"}</span>}
                        </div>



                        {/* Second Row */}
                        <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context text-sm">
                            <span>Date of Birth</span>
                            <span className="w-full px-2 overflow-x-auto whitespace-nowrap text-center text-sm">mohammadhemmatain8273@gmail.com</span>
                        </div>

                        <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context text-sm">
                            <span>Document Number</span>
                            <span className="w-full px-2 overflow-x-auto whitespace-nowrap text-center text-sm">873hidsub</span>
                        </div>

                        <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context text-sm">
                            <span>Document</span>
                            <Image src={Document}
                                alt="Icon for Photo Upload"
                                width={28}
                                height={28}
                                className='w-7 h-7' />
                        </div>


                        {/* Third Row */}
                        <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context">
                            <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                                <span>Country</span>
                                <Image
                                    src={Edit}
                                    width={16}
                                    height={16}
                                    alt="icon for user edit name"
                                    className="w-4 h-4" />
                            </div>
                            {editing === "countryCode" ? < Input className="text-foreground" value={"Iran"} /> : <span className="text-foreground" >{"Iran"}</span>}
                        </div>

                        <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context">
                            <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                                <span>State</span>
                                <Image
                                    src={Edit}
                                    width={16}
                                    height={16}
                                    alt="icon for user edit name"
                                    className="w-4 h-4" />
                            </div>
                            {editing === "state" ? < Input className="text-foreground" value={"Tehran"} /> : <span className="text-foreground" >{"Tehran"}</span>}
                        </div>

                        <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context">
                            <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                                <span>City</span>
                                <Image
                                    src={Edit}
                                    width={16}
                                    height={16}
                                    alt="icon for user edit name"
                                    className="w-4 h-4" />
                            </div>
                            {editing === "city" ? < Input className="text-foreground" value={"Tehran"} /> : <span className="text-foreground" >{"Tehran"}</span>}
                        </div>

                        {/* Fourth Row */}
                        <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context">
                            <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                                <span>Postal Code</span>
                                <Image
                                    src={Edit}
                                    width={16}
                                    height={16}
                                    alt="icon for user edit name"
                                    className="w-4 h-4" />
                            </div>
                            {editing === "postalcode" ? < Input className="text-foreground" value={"931482726"} /> : <span className="text-foreground" >{"931482726"}</span>}
                        </div>

                        <div className="col-span-8 row-span-1 w-full h-full flex flex-col justify-center bg-card rounded-2xl p-2 items-center text-card-context">
                            <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                                <span>Address</span>
                                <Image
                                    src={Edit}
                                    width={16}
                                    height={16}
                                    alt="icon for user edit name"
                                    className="w-4 h-4" />
                            </div>
                            {editing === "address" ? < Input className="text-foreground" value={"Address"} /> : <span className="text-foreground" >{"22st , Pastor , Ahmadabad,Mashhad,Iran"}</span>}
                        </div>

                    </div>

                </Card>
            </Glass>
        </section >
    )
}
