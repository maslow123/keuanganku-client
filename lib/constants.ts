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

const transaction_action = { ...pos_type };

export { status, pos_type, transaction_type, transaction_action };