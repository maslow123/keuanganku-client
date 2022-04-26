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
    },
    pos: {
        list: [
            {
                id: 1,
                type: 0,
                name: 'POS 1',
                total: 50000000,
                color: '#D3D3D3'
            },
            {
                id: 2,
                type: 1,
                name: 'POS 2',
                total: 70000000,
                color: '#B0B0B0'
            },
        ]
    },
    transaction: {
        list: [
            {
                amount: 100000,
                type: 0                 
            },
            {
                amount: 200000,
                type: 1                
            },
            {
                amount: 300000,
                type: 1                
            },
            {
                amount: 400000,
                type: 1                
            },
            {
                amount: 500000,
                type: 0                 
            }
        ]
    }
};

export { mock };