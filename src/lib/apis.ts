const apis = {
    sendCodeApi: () => '/api/send-code',
    checkUserNameApi: (email: string) => `/api/check-user-name?email=${email}`,
    updateUserApi: () => '/api/user',
}

export default apis;
