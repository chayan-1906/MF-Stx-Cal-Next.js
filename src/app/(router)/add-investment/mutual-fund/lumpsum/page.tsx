import {MetadataProps} from "@/types";
import {Metadata, ResolvingMetadata} from "next";
import AppWrapperLayout from "@/components/AppWrapperLayout";
import ServerAddMfLumpsum from "@/app/(router)/add-investment/mutual-fund/lumpsum/ServerAddMfLumpsum";

export async function generateMetadata({params, searchParams}: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    console.log('generateMetadata called');

    const title = 'Add Mutual Fund Lumpsum';
    const description = '';
    const parentMetadata = await parent;

    return {
        title,
        description,
        // icons: parentMetadata.icons,
        openGraph: {
            title,
            description,
            url: process.env.BASE_URL || 'http://localhost:3000',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

async function AddMFLumpsumsPage() {
    return (
        <AppWrapperLayout>
            <ServerAddMfLumpsum/>
        </AppWrapperLayout>
    );
}

export default AddMFLumpsumsPage;
