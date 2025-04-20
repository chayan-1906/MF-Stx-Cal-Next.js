import LoginForm from "@/components/LoginForm";
import {BASE_URL} from "@/lib/config";
import {Metadata} from 'next';

export async function generateMetadata(parent: Promise<Metadata>): Promise<Metadata> {
    console.log('generateMetadata called');

    const title = 'Login';
    const description = '';
    const parentMetadata = await parent;

    return {
        title,
        description,
        icons: parentMetadata.icons,
        openGraph: {
            title,
            description,
            url: BASE_URL,
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
