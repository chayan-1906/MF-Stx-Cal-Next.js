import {EditMFSIPsPageProps, MetadataProps} from "@/types";
import {Metadata, ResolvingMetadata} from "next";
import AppWrapperLayout from "@/components/AppWrapperLayout";
import ServerEditMfSip from "@/app/(router)/edit-investment/mutual-fund/sip/[mfSipExternalId]/ServerEditMfSip";

export async function generateMetadata({params, searchParams}: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    console.log('generateMetadata called');

    const title = 'Edit Mutual Fund SIP';
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

async function EditMFSIPsPage({params}: EditMFSIPsPageProps) {
    const {mfSipExternalId} = await params || {};

    return (
        <AppWrapperLayout>
            <ServerEditMfSip mfSipExternalId={mfSipExternalId}/>
        </AppWrapperLayout>
    );
}

export default EditMFSIPsPage;
