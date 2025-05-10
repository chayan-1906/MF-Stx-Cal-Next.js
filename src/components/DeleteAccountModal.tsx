import {Modal, useModal} from "@/components/ui/custom/custom-modal";
import {DeleteAccountModalProps} from "@/types";
import {doLogout} from "@/app/actions";
import {useCallback} from "react";
import axios from "axios";
import apis from "@/lib/apis";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";

function DeleteAccountModal({openModalKey: rawOpenModalKey}: DeleteAccountModalProps) {
    const {onClose} = useModal();

    const deleteAccount = useCallback(async () => {
        const deleteAccountResponse = await axios.delete<ApiResponse>(apis.deleteAccountApi());
        if (deleteAccountResponse.data.success) {
            toast.success('Account deleted successfully');
            await doLogout();
            onClose();
        } else {
            toast.error('Failed to delete account');
        }
    }, [onClose]);

    return (
        <Modal modalKey={rawOpenModalKey} className={'p-2'} title={'Delete Account'} description={'Are you sure you want to delete your account? This action is irreversible'}
               actionButtonLabel={'Delete'} actionButtonVariant={'destructive'} onAction={deleteAccount}>
            <div></div>
        </Modal>
    );
}

export default DeleteAccountModal;
