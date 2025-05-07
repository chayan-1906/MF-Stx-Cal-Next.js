import React from "react";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
import {ServerDashboardProps} from "@/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MonthlyOverview from "@/components/dashboard/MonthlyOverview";
import {getMfLumpsumsByToken, getMFSIPsByDayOfMonth, getMfSipsByToken} from "@/lib/db/mf-sips-storage";
import SIPView from "@/components/dashboard/SIPView";

async function ServerDashboard({isLoggedIn, userId, email}: ServerDashboardProps) {
    console.log('ServerDashboard isLoggedIn:', isLoggedIn);
    console.log('Rendered on:', typeof window === 'undefined' ? 'server' : 'client');
    if (!isLoggedIn) {
        redirect(routes.loginPath());
    }

    const today = new Date();

    const [getMfSipsResponse, getMfSipsByDayOfMonthResponse, getMfLumpsumsResponse] = await Promise.all([
        getMfSipsByToken(),
        getMFSIPsByDayOfMonth(today.getFullYear(), today.getMonth()),
        getMfLumpsumsByToken(),
    ]);

    if (!getMfSipsResponse.success || !getMfSipsByDayOfMonthResponse.success || !getMfLumpsumsResponse.success) {
        return (
            <div className={'bg-rose-400'}>
                Something went wrong - {JSON.stringify(!getMfSipsResponse.success ? getMfSipsResponse.data : getMfSipsByDayOfMonthResponse.data)}
            </div>
        );
    }

    return (
        <div className={'flex min-h-screen flex-col items-center justify-center'}>
            <main className={'flex-1 py-6 w-full space-y-4'}>
                <DashboardHeader userId={userId || null}/>
                <MonthlyOverview sipTotals={getMfSipsByDayOfMonthResponse.data.totals} lumpsums={getMfLumpsumsResponse.data.mfLumpsums}/>
                <SIPView mfSipsByDate={getMfSipsByDayOfMonthResponse.data.mfSips} allMfSips={getMfSipsResponse.data.mfSips}/>
            </main>
        </div>
    );
}

export default ServerDashboard;
