import {doLogout} from "@/app/actions";
import {Button} from "@/components/ui/button";

function Logout() {
    return (
        <form action={doLogout}>
            <Button variant={'destructive'} className={'my-2 py-1 px-3 rounded-md'}>Logout</Button>
        </form>
    );
}

export default Logout;
