import {Metadata, ResolvingMetadata} from 'next';
import {MetadataProps} from "@/types";
import ServerLogin from "@/app/(router)/login/ServerLogin";
import AppWrapperLayout from "@/components/AppWrapperLayout";

export async function generateMetadata({params, searchParams}: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
    console.log('generateMetadata called');

    const title = 'Login';
    const description = 'Login page';
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

async function LoginPage() {
    return (
        <AppWrapperLayout>
            <ServerLogin/>
        </AppWrapperLayout>
    );
}

export default LoginPage;
