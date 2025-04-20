import React from "react";
import Image from "next/image";
import Logout from "@/components/Logout";
import {getUserFromDb} from "@/lib/db/user-storage";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
import DeleteAccount from "@/components/DeleteAccount";
import MFSIP from "@/components/MF-SIP";

export const dynamic = 'force-dynamic';

async function Home() {
    const user = await getUserFromDb();
    if (!user) {
        redirect(routes.loginPath());
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="max-w-sm">
                <div>
                    <Image
                        className="rounded-lg"
                        src={user?.image || "https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                        // src={"https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                        alt="img"
                        width={500}
                        height={500}
                        priority
                    />
                </div>
                <div>
                    {/*<h1 className="mb-2 text-2xl font-bold">Welcome, {session?.user.name}!</h1>*/}
                    <h1 className="mb-2 text-2xl font-bold">Welcome! {user.name}</h1>
                    <h1 className="mb-2 text-2xl font-bold">{user.email}</h1>
                    <p className="text-muted-foreground">
                        If you are learning something valuable from this video, please like
                        and subscribe to my channel.
                    </p>
                </div>
            </div>

            <MFSIP/>

            {/*<MFStxCalDashboard/>*/}

            <Logout/>
            <DeleteAccount/>
        </main>
    );
}

export default Home;
