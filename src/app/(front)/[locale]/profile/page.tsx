import React from 'react';
import UserProfile from '@/components/profile/user-profile';
import Cards from "@/components/profile/cards";
export default function Profile() {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='w-full h-full  py-3 px-10 flex flex-row justify-between gap-3'>
                <div className='w-1/3 h-fit flex flex-col gap-y-3'>
                    <div className='w-full h-fit'>
                        <UserProfile />
                    </div>
                    <div className='flex-1 w-full h-full'>
                        <Cards />
                    </div>
                </div>
                <div className='w-1/3 h-full flex flex-col justify-center items-center'>
                    <div className='w-1/3 h-3/4 flex flex-col justify-center items-center'></div>
                    <div className='w-1/3 h-1/4 flex flex-col justify-center items-center'></div>
                </div>
                <div className='w-1/3 h-full flex flex-col justify-center items-center'>

                </div>
            </div>
        </div>
    )
}