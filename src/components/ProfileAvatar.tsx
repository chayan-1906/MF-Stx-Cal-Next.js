'use client';

import React from "react";
import {ProfileAvatarProps} from "@/types";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useModal} from "@/components/ui/custom/custom-modal";
import LogoutModal from "@/components/LogoutModal";
import {modalKeys} from "@/lib/modalKeys";
import DeleteAccountModal from "@/components/DeleteAccountModal";

function ProfileAvatar({name, picture}: ProfileAvatarProps) {
    const {onOpen: onLogoutModalOpen, setOpenModalKey: setLogoutModalOpenKey} = useModal();
    const {onOpen: onDeleteAccModalOpen, setOpenModalKey: setDeleteAccModalOpenKey} = useModal();

    return (
        <>
            <LogoutModal openModalKey={modalKeys.logout}/>
            <DeleteAccountModal openModalKey={modalKeys.deleteAccount}/>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={picture}/>
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem variant={'destructive'} onClick={() => (onLogoutModalOpen(), setLogoutModalOpenKey(modalKeys.logout))}>Logout</DropdownMenuItem>
                    <DropdownMenuItem variant={'destructive'} onClick={() => (onDeleteAccModalOpen(), setDeleteAccModalOpenKey(modalKeys.deleteAccount))}>Delete Account</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default ProfileAvatar;
