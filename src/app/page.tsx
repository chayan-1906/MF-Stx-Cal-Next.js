import React from "react";
import Image from "next/image";
import Logout from "@/components/Logout";
import {getUserFromDb} from "@/lib/db/user-storage";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
import DeleteAccount from "@/components/DeleteAccount";
import MFSIPForm from "@/components/mutual-funds/MFSIPForm";
import {getMfSipsByToken} from "@/lib/db/mf-sips-storage";
import MFSIP from "@/components/MF-SIP";

export const dynamic = 'force-dynamic';

async function Home() {
    const user = await getUserFromDb();
    if (!user) {
        redirect(routes.loginPath());
    }

    const getMfSipsResponse = await getMfSipsByToken();
    if (!getMfSipsResponse.success) {

    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="max-w-sm">
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
            </div>

            {/*<MFSIP userId={user.id} mfSips={getMfSipsResponse.data.mfSips}/>*/}
            <MFSIP userId={user.id} mfSips={getMfSipsResponse.data.mfSips}/>
            <MFSIPForm userId={user.id}/>

            {/*<MFStxCalDashboard/>*/}

            <Logout/>
            <DeleteAccount/>
        </main>
    );
}

export default Home;
