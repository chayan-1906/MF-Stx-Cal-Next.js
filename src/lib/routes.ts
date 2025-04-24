const routes = {
    homePath: () => '/',
    loginPath: () => '/login',

    addMfSipPath: () => '/add-investment/mutual-fund/sip',
    updateMfSipPath: (mfSipId: string) => `/edit-investment/mutual-fund/sip/${mfSipId}`,
}

export default routes;
