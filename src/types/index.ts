import {MFSIP} from "@/models/MFSIP";
import React, {Dispatch, SetStateAction} from "react";

/** metadata */
export interface MetadataProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** reusable components */
export interface CustomResponsiveModalProps {
    id?: string;
    modalKey: string;
    title: string;
    titleColor?: string;
    body: React.ReactNode;
    onAction?: () => void;
    actionLabel?: string;
    actionBgColor?: 'default' | 'secondary' | 'destructive' | 'link' | 'outline' | 'ghost';
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
    footer?: React.ReactNode;
    isDisabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

export interface CustomResponsiveModalFooterProps {
    onAction?: () => void;
    actionLabel?: string;
    actionBgColor?: 'default' | 'secondary' | 'destructive' | 'link' | 'outline' | 'ghost';
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
    footer?: React.ReactNode;
    isDisabled?: boolean;
    isLoading?: boolean;
}

export interface MFSIPFormModalProps {
    userId: string;
    mfSipId?: string;
    mfSip?: MFSIP | null;
    setMfSip?: Dispatch<SetStateAction<MFSIP | null>>;
    openModalKey: string;
}

export interface AppWrapperLayoutChildProps {
    isLoggedIn?: boolean;
    userId: string | undefined;
    email: string | undefined;
}

export interface AppWrapperLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export interface NavbarProps {
    // userId: string | undefined;
    // email: string | undefined;
    isLoggedIn: boolean;
}


/** page components */
export interface ServerLoginProps {
    isLoggedIn?: boolean;
}

export interface ServerDashboardProps {
    isLoggedIn?: boolean;
    userId?: string | undefined;
    email?: string | undefined;
}

export interface DashboardHeaderProps {
    userId: string | null;
}

export interface MFSIPProps {
    userId: string;
    mfSip?: MFSIP | null;
}
