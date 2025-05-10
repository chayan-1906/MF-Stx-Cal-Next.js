import MFSIPForm from "@/components/mutual-funds/MFSIPForm";
import {ServerEditMfSipProps} from "@/types";
import {getMfSipByExternalId} from "@/lib/db/mf-sips-storage";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";

async function ServerEditMfSip({isLoggedIn, userId, mfSipExternalId}: ServerEditMfSipProps) {
    if (!isLoggedIn) {
        redirect(routes.loginPath());
    }

    const getMfSipByExternalIdResponse = await getMfSipByExternalId(mfSipExternalId);
    if (!getMfSipByExternalIdResponse.success) {
        // TODO: Something went wrong - need to copy

        return (
            <div className={'font-bold text-4xl text-center text-text-900'}>
                {getMfSipByExternalIdResponse.message}
            </div>
        );
    }

    return (
        <div className={'flex items-center justify-center md:p-4 bg-background'}>
            <div className={'w-full max-w-7xl bg-background bg-gradient-to-tl from-gradient-tl to-gradient-br rounded-2xl p-3 md:p-6 space-y-6 shadow-2xl shadow-primary'}>
                <MFSIPForm userId={userId ?? ''} mfSip={getMfSipByExternalIdResponse.data.mfSip}/>
            </div>
        </div>
    );
}

export default ServerEditMfSip;
