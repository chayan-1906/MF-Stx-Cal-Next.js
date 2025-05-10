import LoginForm from "@/components/auth/LoginForm";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
import {ServerLoginProps} from "@/types";

function ServerLogin({isLoggedIn}: ServerLoginProps) {
    if (isLoggedIn) {
        redirect(routes.homePath());
    }

    return (
        <LoginForm/>
    );
}

export default ServerLogin;
