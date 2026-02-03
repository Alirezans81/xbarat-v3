"use client"

import Image from 'next/image';
import userProfileCircle from "../../../public/User_cicrle_duotone.png";
import UploadPhotoIcon from "../../../public/Profile/UploadPhoto.png";
import Edit from "../../../public/Profile/Edit.png";
import Document from "../../../public/Profile/Document.png";
import LogOut from "../../../public/Profile/LogOut.png";
import { useState } from 'react';
import { Input } from '../ui/input';
import { useAuthStore } from '@/lib/front/stores/auth';
import { User } from '@/generated/prisma';
import { Card, CardHeader } from '../ui/card';

export default function UserProfile() {

    const { user, setUser } = useAuthStore();
    const [editing, setEditing] = useState<string>("");
    // const [userData, setUserData] = useState<SafeUser | null>(user);
    function handleEdit(val: keyof User) {
        setEditing(val);
        if (!user) {
            return;
        }
    }

    function handleBlur() {
        setEditing("");
        /*Patch the data*/
    }

    return (
        <Card className='w-full h-full'>
            <CardHeader className='w-full flex justify-center'>
                <div className='w-fit h-fit relative'>
                    {/* Profile Photo */}
                    <Image
                        src={userProfileCircle}
                        width={120}
                        height={120}
                        alt='user photo'
                        className='w-30 h-30 rounded-full object-cover'
                    />

                    {/* Upload Icon - positioned at bottom-right */}
                    <div className='absolute bottom-2 right-2 z-10 rounded-full'>
                        <Image
                            src={UploadPhotoIcon}
                            width={28}
                            height={28}
                            alt='icon for user upload photo'
                            className='w-7 h-7'
                        />
                    </div>
                </div>
            </CardHeader>
            {/* edit name and name */}
            <div className='w-full h-fit flex flex-row justify-center gap-x-2'>
                <Image
                    src={Edit}
                    width={16}
                    height={16}
                    alt='icon for user edit name'
                    className='w-4 h-4'
                />
                <span className='text-white'>{user?.fullName}</span>
            </div>

            <div className='flex-1 w-fit h-fit max-h-72  grid grid-cols-6 grid-rows-4 gap-x-2 gap-y-3 py-1 px-1'>
                {/* First Row */}
                <Card className='col-span-3 row-span-1 w-full h-full '>
                    <div className='w-full h-full flex flex-col justify-center items-center '>
                        <span className='w-fit h-fit text-card-foreground/50 text-md'>Email</span>
                        <span className='w-fit h-fit text-card-foreground/50 text-sm'>{user?.email}</span>
                    </div>
                </Card>
                <div className='col-span-3 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1 px-5'>
                    <div className='w-fit h-fit flex flex-row text-card-foreground/50 text-md items-center gap-x-3'>
                        <span>Phone Number</span>
                        <button onClick={() => handleEdit("phoneNumber")} className='hover:cursor-pointer w-fit h-fit'>
                            <Image
                                src={Edit}
                                width={12}
                                height={12}
                                alt='icon for user edit name'
                                className='w-3 h-3'
                            />
                        </button>
                    </div>

                    {editing === "phoneNumber" ?
                        <Input onBlur={() => handleBlur()}
                            onChange={(e) =>
                                setUser(user ? {
                                    ...user,
                                    phoneNumber: e.target.value
                                } as User : null)
                            }
                            value={user?.phoneNumber} className='w-fit h-fit text-card-foreground/50 text-sm' /> :
                        <span className='w-fit h-fit text-card-foreground/50 text-sm'>{user?.phoneNumber}</span>
                    }
                </div>



                {/* Second Row */}
                <div className='col-span-2 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1 px-5'>
                    <span className='w-fit h-fit text-card-foreground/50 text-md'>Date of Birth</span>
                    <span className='w-fit h-fit text-card-foreground/50 text-sm'>{user?.dateOfBirth?.toString()}</span>
                </div>
                <div className='col-span-2 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1'>
                    <span className='w-fit  h-fit text-card-foreground/50 text-sm'>Document Number</span>
                    <span className='w-fit h-fit text-card-foreground/50 text-sm'>{user?.documentNumber}</span>
                </div>
                <div className='col-span-2 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1 px-5'>
                    <span className='w-fit h-fit text-card-foreground/50 text-md'>Document</span>
                    <button><Image src={Document} alt="Document" width={28} className='w-5 h-4' /></button>
                </div>




                {/* Third Row */}
                <div className='col-span-2 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1 px-5'>
                    <div className='w-fit h-fit flex flex-row text-card-foreground/50 text-md items-center gap-x-3'>
                        <span>Country</span>
                        <button onClick={() => handleEdit("countryCode")} className='hover:cursor-pointer w-fit h-fit'>
                            <Image
                                src={Edit}
                                width={12}
                                height={12}
                                alt='icon for user edit name'
                                className='w-3 h-3'
                            />
                        </button>
                    </div>

                    {editing === "countryCode" ?
                        <Input onBlur={() => handleBlur()} onChange={(e) =>
                            setUser(user ? {
                                ...user,
                                countryCode: e.target.value
                            } as User : null)
                        }
                            value={user?.countryCode} className='w-40 h-fit text-card-foreground text-sm' /> :
                        <span className='w-fit h-fit text-card-foreground text-sm'>{user?.countryCode === "IR" ? "Iran" : ""}</span>
                    }
                </div>

                <div className='col-span-2 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1 px-5'>
                    <div className='w-fit h-fit flex flex-row text-card-foreground/50 text-md items-center gap-x-3'>
                        <span>State</span>
                        <button onClick={() => handleEdit("state")} className='hover:cursor-pointer w-fit h-fit'>
                            <Image
                                src={Edit}
                                width={12}
                                height={12}
                                alt='icon for user edit name'
                                className='w-3 h-3'
                            />
                        </button>
                    </div>

                    {editing === "State" ?
                        <Input onBlur={() => handleBlur()} onChange={(e) =>
                            setUser(user ? {
                                ...user,
                                state: e.target.value
                            } as User : null)
                        }
                            value={user?.state?.toString()} className='w-40 h-fit text-card-foreground text-sm' /> :
                        <span className='w-fit h-fit text-card-foreground text-sm'>{user?.state}</span>
                    }
                </div>

                <div className='col-span-2 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1 px-5'>
                    <div className='w-fit h-fit flex flex-row text-card-foreground/50 text-md items-center gap-x-3'>
                        <span>City</span>
                        <button onClick={() => handleEdit("city")} className='hover:cursor-pointer w-fit h-fit'>
                            <Image
                                src={Edit}
                                width={12}
                                height={12}
                                alt='icon for user edit name'
                                className='w-3 h-3'
                            />
                        </button>
                    </div>

                    {editing === "city" ?
                        <Input onBlur={() => handleBlur()} onChange={(e) =>
                            setUser(user ? {
                                ...user,
                                city: e.target.value
                            } as User : null)
                        }
                            value={user?.city?.toString()} className='w-40 h-fit text-card-foreground text-sm' /> :
                        <span className='w-fit h-fit text-card-foreground text-sm'>{user?.city}</span>
                    }
                </div>


                {/* Fourth Row */}
                <div className='col-span-2 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1'>
                    <div className='w-fit h-fit flex flex-row text-card-foreground/50 text-md items-center gap-x-3'>
                        <span>Postal Code</span>
                        <button onClick={() => console.log("Phone Number add")} className='hover:cursor-pointer w-fit h-fit'>
                            <Image
                                src={Edit}
                                width={12}
                                height={12}
                                alt='icon for user edit name'
                                className='w-3 h-3'
                            />
                        </button>
                    </div>
                    <span className='w-fit h-fit text-card-foreground text-sm'>{user?.postalCode}</span>
                </div>

                <div className='col-span-4 row-span-1 w-full h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-card/25 to-card/5 border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] justify-center items-center rounded-2xl py-1'>
                    <div className='w-fit h-fit flex flex-row text-card-foreground/50 text-md items-center gap-x-3'>
                        <span>Address</span>
                        <button onClick={() => console.log("Phone Number add")} className='hover:cursor-pointer w-fit h-fit'>
                            <Image
                                src={Edit}
                                width={12}
                                height={12}
                                alt='icon for user edit name'
                                className='w-3 h-3'
                            />
                        </button>
                    </div>
                    <span className='w-fit h-fit text-card-foreground text-sm'>{user?.address}</span>
                </div>

            </div>
            {/* Last Row LogOut */}
            <div className='w-full h-fit flex justify-between items-center flex-row px-5 py-3'>
                <button onClick={() => console.log("Log out")} className='w-fit h-full flex flex-row justify-start items-center gap-x-2 hover:cursor-pointer'>
                    <Image alt="Logging out" src={LogOut} width={24} height={24} className='w-6 h-6' />
                    <span className='text-red w-fit text-md min-w-16 font-bold'>Log out</span>
                </button>
                <button className='w-fit h-full text-primary font-bold hover:cursor-pointer' onClick={() => console.log("Change Pass")}>Change Password</button>
            </div>

        </Card>
    )
}
