import {ServerAddMfSipProps} from "@/types";
import MFLumpsumForm from "@/components/mutual-funds/MFLumpsumForm";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";

function ServerAddMfLumpsum({isLoggedIn, userId}: ServerAddMfSipProps) {
    if (!isLoggedIn) {
        redirect(routes.loginPath());
    }

    return (
        <div className={'flex items-center justify-center md:p-4 bg-background'}>
            <div className={'w-full max-w-7xl bg-background bg-gradient-to-tl from-gradient-tl to-gradient-br rounded-2xl p-3 md:p-6 space-y-6 shadow-2xl shadow-primary'}>
                <MFLumpsumForm userId={userId ?? ''}/>
            </div>
        </div>
    );
}

export default ServerAddMfLumpsum;
