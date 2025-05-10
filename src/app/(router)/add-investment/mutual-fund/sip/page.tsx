import {MetadataProps} from "@/types";
import {Metadata, ResolvingMetadata} from "next";
import AppWrapperLayout from "@/components/AppWrapperLayout";
import ServerAddMfSip from "@/app/(router)/add-investment/mutual-fund/sip/ServerAddMfSip";

export async function generateMetadata({params, searchParams}: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    console.log('generateMetadata called');

    const title = 'Add Mutual Fund SIP';
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

async function AddMFSIPsPage() {
    return (
        <AppWrapperLayout>
            <ServerAddMfSip/>
        </AppWrapperLayout>
    );
}

export default AddMFSIPsPage;
