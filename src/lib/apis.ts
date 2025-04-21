const apis = {
    sendCodeApi: () => '/api/send-code',
    checkUserNameApi: (email: string) => `/api/check-user-name?email=${email}`,
    updateUserApi: () => '/api/user',
    deleteAccountApi: () => '/api/delete-account',

    /** SIPs */
    addMFSIPApi: () => '/api/mf/sips',
    getAllMFSIPsApi: () => '/api/mf/sips',
    // getMFSIPByIdApi: (sipId: string) => `/api/mf/sips?sipId=${sipId}`,
    updateMFSIPApi: () => '/api/mf/sips',
    deleteMFSIPByIdApi: (mfSipId: string) => `/api/mf/sips?mfSipId=${mfSipId}`,
}

export default apis;
