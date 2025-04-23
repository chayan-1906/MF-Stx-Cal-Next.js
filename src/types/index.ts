import {MFSIP} from "@/models/MFSIP";
import React from "react";

export type MetadataProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface AppWrapperLayoutChildProps {
    isLoggedIn?: boolean;
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

export interface ServerLoginProps {
    isLoggedIn?: boolean;
}

export interface ServerDashboardProps {
    isLoggedIn?: boolean;
}

export interface MFSIPProps {
    userId: string;
    mfSip?: MFSIP;
}
