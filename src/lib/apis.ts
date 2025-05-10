import {isStringInvalid} from "@/lib/utils";

const apis = {
    sendCodeApi: () => '/api/send-code',
    checkUserNameApi: (email: string) => `/api/check-user-name?email=${email}`,
    updateUserApi: () => '/api/user',
    deleteAccountApi: () => '/api/delete-account',

    /** MF Funds */
    addMFFundApi: () => '/api/mf/funds',
    getAllMFFundsApi: function (searchTerm: string) {
        let url = '/api/mf/funds';
        const queryParams = [];

        if (!isStringInvalid(searchTerm)) {
            queryParams.push(`searchTerm=${searchTerm}`);
        }

        if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
        }
        return url;
    },

    /** MF SIPs */
    addMFSIPApi: () => '/api/mf/sips',
    getAllMFSIPsApi: () => '/api/mf/sips',
    // getMFSIPByIdApi: (sipId: string) => `/api/mf/sips?sipId=${sipId}`,
    updateMFSIPApi: () => '/api/mf/sips',
    deleteMFSIPByIdApi: (mfSipId: string) => `/api/mf/sips?mfSipId=${mfSipId}`,

    /** MF Lumpsums */
    addMFLumpsumApi: () => '/api/mf/lumpsums',
    getAllMFLumpsumsApi: () => '/api/mf/lumpsums',
    updateMFLumpsumApi: () => '/api/mf/lumpsums',
    deleteMFLumpsumByIdApi: (mfLumpsumId: string) => `/api/mf/lumpsums?mfLumpsumId=${mfLumpsumId}`,
}

export default apis;
