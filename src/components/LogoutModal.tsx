import {Modal, useModal} from "@/components/ui/custom/custom-modal";
import {LogoutModalProps} from "@/types";
import {doLogout} from "@/app/actions";

function LogoutModal({openModalKey: rawOpenModalKey}: LogoutModalProps) {
    const {onClose} = useModal();

    return (
        <Modal modalKey={rawOpenModalKey} className={'p-2'} title={'Logout'} description={'Are you sure you want to logout?'}
               actionButtonLabel={'Logout'} actionButtonVariant={'destructive'} onAction={async () => (await doLogout(), onClose())}>
            <div></div>
        </Modal>
    );
}

export default LogoutModal;
