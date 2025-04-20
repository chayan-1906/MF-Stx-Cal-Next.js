const apis = {
    sendCodeApi: () => '/api/send-code',
    checkUserNameApi: (email: string) => `/api/check-user-name?email=${email}`,
    updateUserApi: () => '/api/user',
    deleteAccountApi: () => '/api/delete-account',
}

export default apis;
