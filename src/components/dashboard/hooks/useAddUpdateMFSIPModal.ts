import {useQueryState} from "nuqs";
import {nuqsModalKeys} from "@/lib/modalKeys";

export const useAddUpdateMFSIPModal = (mfSipId: string | undefined = '') => {
    const [queryValue, setQueryValue] = useQueryState(nuqsModalKeys.addUpdateMFSIP, {
        defaultValue: '',
    });

    const isOpen = mfSipId ? queryValue === mfSipId : queryValue === 'add';

    const open = async (purpose: 'add' | 'update') => {
        if (purpose === 'update' && !mfSipId) {
            throw new Error('mfSipId is required for update');
        }
        await setQueryValue(purpose === 'add' ? 'add' : mfSipId);
    }

    const close = async () => await setQueryValue('')

    return {isOpen, open, close, setQueryValue};
}
