import axios from "axios";
import apis from "@/lib/apis";
import {MFFund} from "@/models/MFFund";
import {useCallback} from "react";

const useMfFunds = () => {
    const fetchAllMfFunds = useCallback(async (searchTerm: string | undefined): Promise<MFFund[] | null> => {
        try {
            console.log('fetchAllMfFunds:', searchTerm);
            const getMfFundsResponse = (await axios.get(apis.getAllMFFundsApi(searchTerm || ''))).data;

            if (!getMfFundsResponse.success) {
                console.error('error in getMfFundsResponse:', getMfFundsResponse.message);
                return null;
            }
            const mfFunds = getMfFundsResponse.data.mfFunds as MFFund[];
            console.log('mfFunds:', mfFunds);

            return mfFunds;
        } catch (error) {
            console.error('inside catch of fetchAllMfFunds:', error);
            return null;
        }
    }, []);

    return {fetchAllMfFunds}
}

export default useMfFunds;
