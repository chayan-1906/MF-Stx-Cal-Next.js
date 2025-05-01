import {Modal, useModal} from "@/components/ui/custom-modal";
import {AddUpdateMFFundFormProps} from "@/types";
import MFFundForm from "@/components/mutual-funds/MFFundForm";

function AddUpdateMFFundForm({userId, openModalKey: rawOpenModalKey, mfSipForm}: AddUpdateMFFundFormProps) {
    const {onClose: onAddFundModalClose, openModalKey} = useModal();

    return (
        <Modal id={''} modalKey={rawOpenModalKey} showClose={false} className={'p-2'}>
            <MFFundForm userId={userId} mfSipForm={mfSipForm}/>
        </Modal>
    );
}

export default AddUpdateMFFundForm;
