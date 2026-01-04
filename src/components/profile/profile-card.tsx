"use client";

import { cn } from "@/lib/front/utils/tailwind";
import { Card } from "../ui/card";
import Glass from "../ui/glass";
import Image from "next/image";
import Camera from "../../../public/Profile/Camera.svg";
import Edit from "../../../public/Profile/Edit.svg";
import Document from "../../../public/Profile/Photo.svg";
import { Input } from "../ui/input";
import { useAuthStore } from "@/lib/front/stores/auth";
import { useState } from "react";
import { User } from "@/generated/prisma";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePutUser } from "@/api/user/profile/hook";
type Props = {
  className?: string;
};

export default function ProfileCard({ className }: Props) {
  const { user, setUser } = useAuthStore();
  const putUser = usePutUser();
  const [editing, setEditing] = useState<string>("");
  const [tempVariable, setTempVariable] = useState<
    Date | boolean | string | null
  >("");

  function handleEdit(val: keyof User) {
    setEditing(val);
    user && setTempVariable(user !== null ? user[val] : "");
  }

  function handleBlur(field: keyof User) {
    if (!user) return;

    const value = tempVariable;

    setEditing("");

    if (value === user[field]) {
      setTempVariable("");
      return;
    }

    putUser({
      user: {
        [field]: value,
      },
      onSuccess: () => {
        setUser({
          ...user,
          [field]: value,
        });
      },
      onFinally: () => {
        setTempVariable("");
      },
    });
  }
  const DisplayName = user?.fullName
    .split(" ")
    .map((e) => e[0])
    .join("");
  return (
    <section className={cn(className)}>
      <Glass className="rounded-lg">
        <Card className="w-full h-full flex flex-col items-center px-3 text-muted-foreground/75">
          {/* Profile Photo and Edit */}
          <div className="w-fit h-fit relative bg-transparent">
            {/* Profile Photo */}

            <Avatar className="w-30 h-30">
              <AvatarImage src={user?.avatarUrl || ""} />
              <AvatarFallback className="">
                <span className=" w-full h-full flex justify-center items-center bg-transparent text-4xl">
                  {DisplayName}
                </span>
              </AvatarFallback>
            </Avatar>
            {/* Upload Icon - positioned at bottom-right */}
            <div className="absolute bottom-2 right-2 z-10 rounded-full">
              <Image
                src={Camera}
                width={28}
                height={28}
                alt="icon for user upload photo"
                className="w-7 h-7"
              />
            </div>
          </div>

          {/* Name */}
          <div className="w-fit h-fit flex flex-row items-center gap-x-3">
            <Button
              onClick={() => handleEdit("fullName")}
              className="w-fit h-fit p-0"
              variant={"ghost"}
            >
              <Image
                src={Edit}
                width={16}
                height={16}
                alt="icon for user edit name"
                className="w-4 h-4"
              />
            </Button>
            {editing === "fullName" ? (
              <Input
                autoFocus
                className="text-foreground"
                value={
                  tempVariable === null
                    ? ""
                    : tempVariable instanceof Date
                    ? tempVariable.toISOString().slice(0, 10)
                    : String(tempVariable)
                }
                onChange={(e) => setTempVariable(e.target.value)}
                onBlur={() => handleBlur("fullName")}
              />
            ) : (
              <span className="">{user?.fullName}</span>
            )}
          </div>

          {/* Grid for user specs */}
          <div className="grid grid-rows-4 grid-cols-12 p-2 gap-2">
            {/* First Row */}
            <div className="col-span-6 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center">
              <span>Email</span>
              <span className="w-full px-2 overflow-x-auto whitespace-nowrap text-center text-sm">
                {user?.email}
              </span>
            </div>

            <div className="col-span-6 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center">
              <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                <span className="">Phone Number</span>
                <Button
                  onClick={() => handleEdit("phoneNumber")}
                  className="w-fit h-fit p-0"
                  variant={"ghost"}
                >
                  <Image
                    src={Edit}
                    width={16}
                    height={16}
                    alt="icon for user edit name"
                    className="w-4 h-4"
                  />
                </Button>
              </div>
              {editing === "phoneNumber" ? (
                <Input
                  autoFocus
                  className="text-foreground"
                  value={
                    tempVariable === null
                      ? ""
                      : tempVariable instanceof Date
                      ? tempVariable.toISOString().slice(0, 10)
                      : String(tempVariable)
                  }
                  onChange={(e) => setTempVariable(e.target.value)}
                  onBlur={() => handleBlur("phoneNumber")}
                />
              ) : (
                <span className="text-foreground">{user?.phoneNumber}</span>
              )}
            </div>

            {/* Second Row */}
            <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center text-sm">
              <span>Date of Birth</span>
              <span className="w-full px-2 overflow-x-auto whitespace-nowrap text-center text-base text-foreground">
                {user?.dateOfBirth ? user?.dateOfBirth.toString() : "No Data!"}
              </span>
            </div>

            <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center text-sm">
              <span className="text-center">Document Number</span>
              <span className="w-full px-2 overflow-x-auto whitespace-nowrap text-center text-base text-foreground">
                {user?.documentNumber ? user?.documentNumber : "No Data!"}
              </span>
            </div>

            <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center text-sm">
              <span>Document</span>
              <Image
                src={Document}
                alt="Icon for Photo Upload"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>

            {/* Third Row */}
            <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center">
              <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                <span>Country</span>
                <Button
                  onClick={() => setEditing("countryCode")}
                  className="w-fit h-fit p-2"
                  variant={"ghost"}
                >
                  <Image
                    src={Edit}
                    width={16}
                    height={16}
                    alt="icon for user edit name"
                    className="w-4 h-4"
                  />
                </Button>
              </div>
              {editing === "countryCode" ? (
                <Input
                  autoFocus
                  className="text-foreground"
                  value={
                    tempVariable === null
                      ? ""
                      : tempVariable instanceof Date
                      ? tempVariable.toISOString().slice(0, 10)
                      : String(tempVariable)
                  }
                  onChange={(e) => setTempVariable(e.target.value)}
                  onBlur={() => handleBlur("countryCode")}
                />
              ) : (
                <span className="text-foreground">{user?.countryCode}</span>
              )}
            </div>

            <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center">
              <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                <span>State</span>
                <Button
                  onClick={() => handleEdit("state")}
                  className="w-fit h-fit p-0"
                  variant={"ghost"}
                >
                  <Image
                    src={Edit}
                    width={16}
                    height={16}
                    alt="icon for user edit name"
                    className="w-4 h-4"
                  />
                </Button>
              </div>
              {editing === "state" ? (
                <Input
                  autoFocus
                  className="text-foreground"
                  value={
                    tempVariable === null
                      ? ""
                      : tempVariable instanceof Date
                      ? tempVariable.toISOString().slice(0, 10)
                      : String(tempVariable)
                  }
                  onChange={(e) => setTempVariable(e.target.value)}
                  onBlur={() => handleBlur("state")}
                />
              ) : (
                <span className="text-foreground">
                  {user?.state ? user?.state : "No Data!"}
                </span>
              )}
            </div>

            <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center">
              <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                <span>City</span>
                <Button
                  onClick={() => handleEdit("city")}
                  className="w-fit h-fit p-0"
                  variant={"ghost"}
                >
                  <Image
                    src={Edit}
                    width={16}
                    height={16}
                    alt="icon for user edit name"
                    className="w-4 h-4"
                  />
                </Button>
              </div>
              {editing === "city" ? (
                <Input
                  autoFocus
                  className="text-foreground"
                  value={
                    tempVariable === null
                      ? ""
                      : tempVariable instanceof Date
                      ? tempVariable.toISOString().slice(0, 10)
                      : String(tempVariable)
                  }
                  onChange={(e) => setTempVariable(e.target.value)}
                  onBlur={() => handleBlur("city")}
                />
              ) : (
                <span className="text-foreground">
                  {user?.city ? user?.city : "No Data!"}
                </span>
              )}
            </div>

            {/* Fourth Row */}
            <div className="col-span-4 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center">
              <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                <span>Postal Code</span>
                <Button
                  onClick={() => handleEdit("postalCode")}
                  className="w-fit h-fit p-0"
                  variant={"ghost"}
                >
                  <Image
                    src={Edit}
                    width={16}
                    height={16}
                    alt="icon for user edit name"
                    className="w-4 h-4"
                  />
                </Button>
              </div>
              {editing === "postalCode" ? (
                <Input
                  autoFocus
                  className="text-foreground"
                  value={
                    tempVariable === null
                      ? ""
                      : tempVariable instanceof Date
                      ? tempVariable.toISOString().slice(0, 10)
                      : String(tempVariable)
                  }
                  onChange={(e) => setTempVariable(e.target.value)}
                  onBlur={() => handleBlur("postalCode")}
                />
              ) : (
                <span className="text-foreground">
                  {user?.postalCode ? user?.postalCode : "No Data!"}
                </span>
              )}
            </div>

            <div className="col-span-8 row-span-1 w-full h-full flex flex-col justify-center bg-accent/50 rounded-2xl p-2 items-center">
              <div className="w-full h-fit flex flex-row items-center justify-center gap-2">
                <span>Address</span>
                <Button
                  onClick={() => handleEdit("address")}
                  className="w-fit h-fit p-0"
                  variant={"ghost"}
                >
                  <Image
                    src={Edit}
                    width={16}
                    height={16}
                    alt="icon for user edit name"
                    className="w-4 h-4"
                  />
                </Button>
              </div>
              {editing === "address" ? (
                <Input
                  autoFocus
                  className="text-foreground"
                  value={
                    tempVariable === null
                      ? ""
                      : tempVariable instanceof Date
                      ? tempVariable.toISOString().slice(0, 10)
                      : String(tempVariable)
                  }
                  onChange={(e) => setTempVariable(e.target.value)}
                  onBlur={() => handleBlur("address")}
                />
              ) : (
                <span className="text-foreground">
                  {user?.address ? user?.address : "No Data!"}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Glass>
    </section>
  );
}
