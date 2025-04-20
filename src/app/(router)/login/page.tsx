import {Metadata, ResolvingMetadata} from 'next';
import {MetadataProps} from "@/types";
import LoginForm from "@/components/LoginForm";

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

function LoginPage() {
    return (
        <div>
            <LoginForm/>
        </div>
    );
}

export default LoginPage;
