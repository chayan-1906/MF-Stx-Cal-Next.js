import {Modal, useModal} from "@/components/ui/custom/custom-modal";
import {useCallback} from "react";
import axios from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import apis from "@/lib/apis";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {DeleteMFSIPProps} from "@/types";

function DeleteMFSIPModal({mfSipId, openModalKey: rawOpenModalKey, selectedSips, setSelectedSips}: DeleteMFSIPProps) {
    const {onClose: onDeleteMFSIPModalClose, openModalId, openModalKey} = useModal();
    const router = useRouter();

    const deleteMfSip = useCallback(async () => {
        try {
            const deleteMfSipResponse = (await axios.delete<ApiResponse>(apis.deleteMFSIPByIdApi(mfSipId))).data;
            if (deleteMfSipResponse.success) {
                toast(deleteMfSipResponse.message, {type: 'success'});
                router.refresh();
                setTimeout(() => {
                    if (selectedSips && setSelectedSips) {
                        setSelectedSips(selectedSips.filter((sip) => sip.mfSipId !== mfSipId));
                    }
                }, 500);
            } else {
                toast(deleteMfSipResponse.message, {type: 'error'});
            }
        } catch (error) {
            toast('Something went wrong', {type: 'error'});
        } finally {
            onDeleteMFSIPModalClose();
        }
    }, [mfSipId, onDeleteMFSIPModalClose, router, selectedSips, setSelectedSips]);

    return (
        <Modal id={mfSipId} modalKey={rawOpenModalKey} className={'p-2'} title={'Delete SIP'} description={'Are you sure you want to delete this SIP?'} titleClassName={'text-destructive'}
               actionButtonLabel={'Delete'} actionButtonVariant={'destructive'} onAction={deleteMfSip}>
            <div></div>
        </Modal>
    );
}

export default DeleteMFSIPModal;
