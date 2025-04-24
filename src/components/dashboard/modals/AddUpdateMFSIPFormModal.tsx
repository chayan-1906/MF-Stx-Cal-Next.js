import React from "react";
import {useAddUpdateMFSIPModal} from "@/components/dashboard/hooks/useAddUpdateMFSIPModal";
import CustomNuqsAnimatedModal from "@/components/modals/CustomNuqsAnimatedModal";

interface AddUpdateMFSIPFormModalProps {
    mfSipId: string;
}

function AddUpdateMFSIPFormModal({mfSipId}: AddUpdateMFSIPFormModalProps) {
    const {isOpen, close} = useAddUpdateMFSIPModal(mfSipId);

    return (
        <CustomNuqsAnimatedModal
            isOpen={isOpen} onClose={close}
            title={mfSipId ? 'Update MFSIP' : 'Create MFSIP'}
            actionBgColor={'secondary'} onAction={() => {
        }} actionLabel={'Save'}
            secondaryActionLabel={'Close'}
            body={
                <div className={'flex flex-col space-y-3'}>
                    <h1 className={'bg-green-400'}>Sample Modal</h1>
                </div>
            }
        />
    );
}

export default AddUpdateMFSIPFormModal;
