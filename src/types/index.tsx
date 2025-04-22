import {MFSIP} from "@/models/MFSIP";

export type MetadataProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface MFSIPProps {
    userId: string;
    mfSip?: MFSIP;
}
