import {MFSIP} from "@/models/MFSIP";
import React from "react";
import type {VariantProps} from "class-variance-authority";
import {buttonVariants} from "@/components/ui/button";
import {MFFund} from "@/models/MFFund";
import {UseFormReturn} from "react-hook-form";
import {MFLumpsumFormValues, MFSIPFormValues} from "@/lib/formValidationSchemas";
import {MFLumpsum} from "@/models/MFLumpsum";

/** metadata */
export interface MetadataProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** reusable components */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

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
    openModalKey: string;
    // isOpen: boolean;
    // onOpenChange: (open: boolean) => void;
    mfSip?: MFSIP | null;
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
    name: string;
    picture: string;
}

export interface ReactSelectOptionType {
    value: MFFund;
    label: string;
}

export interface MFFundsSelectProps {
    value: string | null;
    onChange: (fund: MFFund | null) => void;
}


/** custom components */
export interface MFFundFormProps {
    userId: string | null;
    mfFund?: MFFund | null;
    mfSipForm?: UseFormReturn<MFSIPFormValues>;
    mfLumpsumForm?: UseFormReturn<MFLumpsumFormValues>;
}

export interface MFSIPFormProps {
    userId: string;
    mfSip?: MFSIP | null;
}

export interface MFLumpsumFormProps {
    userId: string;
    mfLumpsum?: MFLumpsum | null;
}

export interface DashboardHeaderProps {
    userId: string | null;
}

export interface AddUpdateMFFundProps {
    userId: string | null;
    openModalKey: string | null;
    mfSipForm?: UseFormReturn<MFSIPFormValues>;
    mfLumpsumForm?: UseFormReturn<MFLumpsumFormValues>;
}

export interface DeleteMFSIPProps {
    mfSipId: string;
    openModalKey: string | null;
    selectedSips?: MFSIP[];
    setSelectedSips?: React.Dispatch<React.SetStateAction<MFSIP[]>>;
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

export interface ServerAddMfSipProps {
    isLoggedIn?: boolean;
    userId?: string;
}

export interface EditMFSIPsPageProps {
    params: Promise<{ mfSipExternalId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface ServerEditMfSipProps {
    isLoggedIn?: boolean;
    userId?: string;
    mfSipExternalId: string;
}


/** dashboard components */
export interface MonthlyOverviewProps {
    sipTotals: {
        totalActiveSipAmount: number;
        amountPaidThisMonth: number;
        amountRemainingThisMonth: number;
    };
    lumpsums: MFLumpsum[];
}

export interface SIPViewProps {
    mfSipsByDate: {
        dayOfMonth: number;
        count: number;
        sips: MFSIP[];
    }[];
    allMfSips: MFSIP[];
}

export interface ToggleSIPViewProps {
    sipViewMode: 'calendar' | 'list';
    setSipViewMode: React.Dispatch<React.SetStateAction<'calendar' | 'list'>>;
}

export interface SIPCalenderViewProps {
    investments: {
        dayOfMonth: number;
        count: number;
        sips: MFSIP[];
    }[];
}

export interface SIPListViewProps {
    investments: MFSIP[];
}
