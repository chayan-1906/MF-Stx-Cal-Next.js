import React from "react";
import type {Metadata} from "next";
import {Nunito_Sans} from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'MFStxCal',
    description: 'Track Your SIPs & Lumpsums, Right on Time',
};

function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang={'en'}>
        <body className={nunitoSans.className}>
        {children}
        </body>
        </html>
    );
}

export default RootLayout;
