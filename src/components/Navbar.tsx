import Link from "next/link";
import {Button} from "@/components/ui/button";
import {auth} from "@/auth";
import routes from "@/lib/routes";
import {doLogout} from "@/app/actions";

export default async function Navbar() {
    const session = await auth();
    console.log({session});

    if (!session?.user) {
        return null;
    }

    return (
        <nav className="flex justify-between items-center py-3 px-4 bg-white shadow-md">
            <Link href="/" className="text-xl font-bold">
                Auth.js
            </Link>
            {!session ? (
                <Link href={routes.loginPath()}>
                    <Button variant="default">Sign In</Button>
                </Link>
            ) : (
                <form action={doLogout}>
                    <Button variant="default" type="submit">
                        Sign Out
                    </Button>
                </form>
            )}
        </nav>
    );
}
