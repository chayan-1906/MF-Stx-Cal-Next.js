import React from "react";
import Image from "next/image";
import Logout from "@/components/Logout";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";

async function Home() {
    // const session = await getSession();
    const session = await auth();
    if (!session || !session.user) {
        redirect(routes.loginPath());
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="max-w-sm">
                <div>
                    <Image
                        className="rounded-lg"
                        // src={session?.user?.image || "https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                        src={"https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                        alt="img"
                        width={500}
                        height={500}
                        priority
                    />
                </div>
                <div>
                    {/*<h1 className="mb-2 text-2xl font-bold">Welcome, {session?.user.name}!</h1>*/}
                    <h1 className="mb-2 text-2xl font-bold">Welcome!</h1>
                    <p className="text-muted-foreground">
                        If you are learning something valuable from this video, please like
                        and subscribe to my channel.
                    </p>
                </div>
            </div>

            <Logout/>
        </main>
    );
}

export default Home;
