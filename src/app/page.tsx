import {auth} from "@/auth";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
import Image from "next/image";
import Logout from "@/components/Logout";

async function Home() {
    const session = await auth();

    if (!session?.user) {
        redirect(routes.loginPath());
    }

    return (
        <div className={'bg-background text-text'}>
            <h1 className={'text-4xl font-black text-primary-600'}>HOME PAGE</h1>

            {session?.user?.name && session?.user?.image ? (
                <>
                    <h1>{session?.user?.name}</h1>
                    <Image src={session?.user?.image || ''} alt={session?.user?.name || ''} height={72} width={72} className={'rounded-full'}/>
                </>
            ) : (
                <h1>Welcome, {session?.user?.email}</h1>
            )}

            <Logout/>
        </div>
    );
}

export default Home;
