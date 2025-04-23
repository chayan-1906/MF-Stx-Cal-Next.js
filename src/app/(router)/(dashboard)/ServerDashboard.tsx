import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MonthlyOverview from "@/components/dashboard/MonthlyOverview";
import Logout from "@/components/Logout";
import DeleteAccount from "@/components/DeleteAccount";
import React from "react";
import {getMfSipsByToken} from "@/lib/db/mf-sips-storage";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
import {ServerDashboardProps} from "@/types";

async function ServerDashboard({isLoggedIn}: ServerDashboardProps) {
    console.log('ServerDashboard isLoggedIn:', isLoggedIn);
    if (!isLoggedIn) {
        redirect(routes.loginPath());
    }

    const getMfSipsResponse = await getMfSipsByToken();
    if (!getMfSipsResponse.success) {
        // TODO: Something went wrong - need to copy
    }

    return (
        <div className={'flex min-h-screen flex-col items-center justify-center'}>
            <h1>isLoggedIn: {isLoggedIn?.toString()}</h1>
            <main className={'flex-1 py-6 w-full space-y-4'}>
                <DashboardHeader/>
                <MonthlyOverview/>
            </main>

            {/*<div className="max-w-sm">
                <div className={'flex gap-4 items-center'}>
                    <Image
                        src={user?.image || "https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                        // src={"https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                        alt="img"
                        width={90}
                        height={20}
                    />
                    <div className={'text-text-900'}>
                        <h1 className="mb-2 text-2xl font-bold">Welcome! {user.name}</h1>
                        <h1 className="mb-2 text-2xl font-bold">{user.email}</h1>
                    </div>
                </div>
            </div>*/}

            {/*<MFSIP userId={user.id} mfSips={getMfSipsResponse.data.mfSips}/>*/}
            {/*<MFSIP userId={user.id} mfSips={getMfSipsResponse.data.mfSips}/>
            <MFSIPForm userId={user.id}/>*/}

            {/*<MFStxCalDashboard/>*/}

            <Logout/>
            <DeleteAccount/>
        </div>
    );
}

export default ServerDashboard;
