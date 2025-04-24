import React from "react";
import {Metadata} from 'next';
import {Nunito_Sans} from "next/font/google";
import "./globals.css";
import {ToastContainer} from "react-toastify";
import {APP_LOGO_URL, APP_NAME, APP_TAGLINE, BASE_URL} from "@/lib/config";
import {NuqsAdapter} from "nuqs/adapters/react";

const nunitoSans = Nunito_Sans({subsets: ['latin']});

export const metadata: Metadata = {
    title: {
        default: `${APP_NAME} | ${APP_TAGLINE}`,
        template: `%s | ${APP_NAME}`,
    },
    description: APP_TAGLINE,
    icons: {
        apple: APP_LOGO_URL, // Should be a string or an array of rel/icon objects depending on version
    },
    openGraph: {
        title: `${APP_NAME} | ${APP_TAGLINE}`,
        description: APP_TAGLINE,
        images: [
            {
                url: APP_LOGO_URL || '',
                alt: `${APP_NAME}-logo`,
                width: 400,
                height: 210,
            },
        ],
        url: BASE_URL,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${APP_NAME} | ${APP_TAGLINE}`,
        description: APP_TAGLINE,
        images: [APP_LOGO_URL || ''],
    },
};

async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang={'en'}>
        <body suppressHydrationWarning className={nunitoSans.className}>
        <NuqsAdapter>
            <div className={'container mx-auto'}>
                {children}
            </div>
            <ToastContainer position={'bottom-right'} theme={'colored'}/>
        </NuqsAdapter>
        </body>
        </html>
    );
}

export default RootLayout;
