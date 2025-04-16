import {doLogout} from "@/app/actions";

function Logout() {
    return (
        <form action={doLogout}>
            <button className={'bg-accent my-2 text-white py-1 px-3 rounded-md'} type={'submit'}>Logout</button>
        </form>
    );
}

export default Logout;
