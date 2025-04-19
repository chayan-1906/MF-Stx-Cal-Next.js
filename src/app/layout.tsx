import React from "react";
import type {Metadata} from "next";
import {Nunito_Sans} from "next/font/google";
import "./globals.css";
import {ToastContainer} from "react-toastify";

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
            <ToastContainer position={'bottom-right'} theme={'colored'}/>
            </body>
        </html>
    );
}

export default RootLayout;
