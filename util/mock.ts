const mock: Record<string, any> = {
    users: {
        login: {
            status: 200,
            error: '',
            user: {
                id: 1,
                name: 'xxx',
                email: 'xxx'
            },
            token: 'xxx'   
        },
        register: {
            status: 200,
            error: '',
            user: {
                id: 1,
                name: 'xxx',
                email: 'xxx'
            }
        }
    }
};

export { mock };