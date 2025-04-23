import {useRouter} from "next/navigation";
import {useModal} from "@/components/ui/responsive-modal";
import {useEffect, useState} from "react";
import CustomResponsiveModal from "@/components/CustomResponsiveModal";
import {MFSIPFormModalProps} from "@/types";
import {isStringInvalid} from "@/lib/utils";
import MFSIPForm from "@/components/mutual-funds/MFSIPForm";

function MFSIPFormModal({userId, mfSipId, mfSip, setMfSip, openModalKey}: MFSIPFormModalProps) {
    const router = useRouter();
    const {openModalKey: useModalOpenKey, onClose} = useModal();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isStringInvalid(useModalOpenKey)) {
            if (setMfSip) {
                setMfSip(null);
            }
        }
    }, [setMfSip, useModalOpenKey]);

    return (
        <CustomResponsiveModal
            id={mfSipId} modalKey={openModalKey} className={'h-full'}
            titleColor={'text-destructive'} title={!isStringInvalid(mfSipId) ? 'Update SIP' : 'Create New SIP'} isLoading={isLoading}
            actionLabel={!isStringInvalid(mfSipId) ? 'Update' : 'Create'} onAction={() => {
        }} actionBgColor={'secondary'}
            secondaryActionLabel={'Cancel'} onSecondaryAction={() => {
        }}
            body={
                <div className={'flex flex-col gap-3 h-96 overflow-auto'}>
                    <MFSIPForm userId={userId} mfSip={mfSip}/>
                </div>
            }
        />
    );
}

export default MFSIPFormModal;
