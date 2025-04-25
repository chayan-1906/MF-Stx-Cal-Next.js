import {ServerAddMfSipProps} from "@/types";
import MFSIPForm from "@/components/mutual-funds/MFSIPForm";

function ServerAddMfSip({isLoggedIn, userId}: ServerAddMfSipProps) {
    return (
        <div className={'flex items-center justify-center p-4 bg-background'}>
            <div className={'w-full max-w-7xl bg-background rounded-2xl p-6 space-y-6 shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#818CF8] dark:shadow-[5px_5px_10px_#1f2937,-5px_-5px_10px_#4F46E5]'}>
                <MFSIPForm userId={userId ?? ''}/>
            </div>
        </div>
    );
}

export default ServerAddMfSip;
