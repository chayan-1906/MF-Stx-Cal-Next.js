const routes = {
    homePath: () => '/',
    loginPath: () => '/login',

    addMfSipPath: () => '/add-investment/mutual-fund/sip',
    updateMfSipPath: (mfSipId: string) => `/edit-investment/mutual-fund/sip/${mfSipId}`,

    addMfLumpsumPath: () => '/add-investment/mutual-fund/lumpsum',
    updateMfLumpsumPath: (mfLumpsumId: string) => `/edit-investment/mutual-fund/lumpsum/${mfLumpsumId}`,
}

export default routes;
