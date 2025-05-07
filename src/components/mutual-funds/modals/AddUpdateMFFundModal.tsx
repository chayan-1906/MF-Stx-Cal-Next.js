import {Modal, useModal} from "@/components/ui/custom/custom-modal";
import {AddUpdateMFFundProps} from "@/types";
import MFFundForm from "@/components/mutual-funds/MFFundForm";

function AddUpdateMFFundModal({userId, openModalKey: rawOpenModalKey, mfSipForm, mfLumpsumForm}: AddUpdateMFFundProps) {
    const {onClose: onAddFundModalClose, openModalKey} = useModal();
    // const isEditing = mfSipForm.getValues().mfFundId;    // wrong condition
    const isEditing = false;

    return (
        <Modal modalKey={rawOpenModalKey} showClose={false} className={'p-2'} title={isEditing ? 'Update Fund' : 'Add Fund'}
               description={isEditing ? 'Modify details of an existing mutual fund, such as name, category, or status' : 'Add a new mutual fund (e.g., Nippon, Motilal Oswal) to the system or list'}>
            <MFFundForm userId={userId} mfSipForm={mfSipForm} mfLumpsumForm={mfLumpsumForm}/>
        </Modal>
    );
}

export default AddUpdateMFFundModal;
