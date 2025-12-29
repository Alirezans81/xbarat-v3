"use client"

import { cn } from "@/lib/front/utils/tailwind";
import Glass from "../ui/glass";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import DropdownArrow from "../../../public/Profile/DropdownArrow.svg";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Ticket } from "@/types/front/ticket";
import { Textarea } from "../ui/textarea";
import Upload from "../../../public/Profile/Upload.svg";
import { useCreateTicketMessage, useCreateTicket } from "@/api/ticket/hook";
type Props = {
    className?: string
}

interface TicketMessageState {
    message: string;
    ticketId?: string;
    id?: string;
    files: File[];
    filesUrl?: string[];
}

export const createTicketMessageFormData = (
    messageData: Partial<TicketMessageState>,
    ticketId: string
): FormData => {
    const formData = new FormData();

    if (messageData.message) {
        formData.append('message', messageData.message);
    }

    formData.append('ticketId', ticketId);

    if (messageData.files && messageData.files.length > 0) {
        messageData.files.forEach((file) => {
            formData.append('files', file);
        });
    }

    if (messageData.id) {
        formData.append('id', messageData.id);
    }

    return formData;
};




export default function TicketCard({ className }: Props) {

    const [ticket, setTicket] = useState<Partial<Ticket>>();
    const [ticketMessage, setTicketMessage] = useState<TicketMessageState>({
        message: "",
        files: [],
    });
    const createTicketMessage = useCreateTicketMessage();
    const createTicket = useCreateTicket();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const maxSize = 5 * 1024 * 1024;
        const validFiles = files.filter(file => file.size <= maxSize);

        if (validFiles.length !== files.length) {
            console.log("Some files exceed the 5MB limit");
        }

        setTicketMessage(prev => ({
            ...prev,
            files: [...(prev.files || []), ...validFiles]
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files || []);

        // Validate file sizes
        const maxSize = 5 * 1024 * 1024;
        const validFiles = files.filter(file => file.size <= maxSize);

        if (validFiles.length !== files.length) {
            toast.error("Some files exceed the 5MB limit");
        }

        setTicketMessage(prev => ({
            ...prev,
            files: [...(prev.files || []), ...validFiles]
        }));
    };
    const removeFile = (index: number) => {
        setTicketMessage(prev => ({
            ...prev,
            files: prev.files?.filter((_, i) => i !== index) || []
        }));
    };




    const subjects = [
        "Customer Service: Problem Assign Exchange",
        "Customer Service: Problem Withdrawal Fee",
        "Customer Service: Problem Deposit Admin Approve",
        "Farabuy: Problem Deposit Admin Approve"
    ]
    function handleCreateTicketAndMessage() {
        if (ticket && ticket !== undefined) {
            createTicket({ ticket: ticket, onSuccess: setTicket });
        }
    }

    useEffect(() => {
        if (ticket?.id && ticketMessage?.message) {
            const formData = createTicketMessageFormData(ticketMessage, ticket.id);
            createTicketMessage({ formData: formData, onSuccess: setTicketMessage });
        }
    }, [ticket?.id, ticketMessage?.message]);

    return (
        <section
            className={cn(className)}
        >
            <Glass className="rounded-lg">
                <Card className="w-full h-full flex flex-col items-center px-7">
                    <span className="text-lg w-full text-start">Tickets</span>
                    <div className="w-full h-full flex flex-col gap-x-3 gap-y-2">

                        {/* Dropdown Subject */}
                        <div className="w-full h-fit">
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button className="w-full h-full bg-card rounded-lg  hover:bg-card-context/40 p-0">
                                        <Glass className="w-full h-full rounded-sm px-3 py-2">
                                            <div className="w-full h-full flex flex-row justify-between items-center">
                                                <span className="w-fit h-fit">{ticket?.subject ? ticket.subject : "Subject"}</span>
                                                <Image src={DropdownArrow} alt="Dropdown Arrow" width={16} height={16} className="w-4 h-4" />
                                            </div>
                                        </Glass>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full h-full">
                                    <DropdownMenuLabel className="text-lg">Subject</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {subjects.map((subject, index) =>
                                        <DropdownMenuItem key={index}
                                            onClick={() =>
                                                setTicket(prev =>
                                                    prev ? { ...prev, subject } : { subject }
                                                )}
                                            className="w-full px-2 py-1 hover:cursor-pointer hover:bg-card-context/40 rounded-lg">
                                            {subject}
                                        </DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Textarea Text */}
                        <div className="w-full h-fit bg-card rounded-xl">
                            <Textarea value={ticketMessage.message?.toString()} className="w-full h-full" placeholder="Enter your Ticket Message..."
                                onChange={(e) =>
                                    setTicketMessage(prev => ({
                                        ...prev,
                                        message: e.target.value,
                                        ticketId: ticket?.id
                                    }))}
                                onBlur={(e) =>
                                    setTicketMessage(prev => prev && { ...prev, message: e.target.value })}
                            />
                        </div>

                        {/* Submit Area Text */}
                        <div className="w-full h-fit flex flex-row rounded-xl items-center">
                            <span className="text-wrap text-start w-7/12 h-fit">
                                Drag and Drop Your Files Here Upload Limit: 5 MB
                                {ticketMessage.files.length > 0 && (
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({ticketMessage.files.length} file{ticketMessage.files.length !== 1 ? 's' : ''} selected)
                                    </span>
                                )}
                            </span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                onChange={handleFileSelect}
                            />

                            <Button
                                onClick={handleUploadClick}
                                className="flex-1 w-fit h-fit"
                                variant={"ghost"}
                            >
                                <Image src={Upload} alt='upload icon' width={20} height={20} className="w-5 h-5" />
                            </Button>

                            <Button
                                onClick={() => handleCreateTicketAndMessage()}
                                className="flex-1 w-fit h-fit"
                                variant={"default"}
                            >
                                <span>Send</span>
                            </Button>
                        </div>
                    </div>
                </Card>
            </Glass>
        </section >
    )
}
