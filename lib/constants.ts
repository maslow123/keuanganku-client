const status = {
    OK: 200,
    Created: 201,
    BadRequest: 400,
    NotFound: 404
};

const transaction_type = {
    0: 'Cash',
    1: 'Transfer'
};

const pos_type = {
    inflow: 0,
    outflow: 1
};

export { status, transaction_type, pos_type };