import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { headers } from 'services/headers';

const hasError = (errors: string[], key: string): Boolean => {
    const invalidEmail = 
        (errors?.length > 0 && errors.find(err => err !== 'email') && errors.find(err => err === 'invalid-format-email')) 
        ? true 
        : false;
    
        if(key === 'email' && invalidEmail) {
            return invalidEmail;
        }
    
    if (key === 'confirm_password') {
        const passwordNotMatch = 
            (errors?.length > 0 && errors.find(err => err !== 'confirm_password') && errors.find(err => err === 'password-not-match')) 
            ? true 
            : false;
        return passwordNotMatch
    }

    return errors?.length > 0 && errors.indexOf(key) !== -1;
};

const checkEmailFormat = (email: string): Boolean => {
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const valid: Boolean = email.match(emailFormat) ? true : false;

    return valid;
};

const validate = (payload: any, noError: any = [] ): any => {
    const key = Object.keys(payload);
    let errors = [];

    key.map(prop => {
        const skipError = noError.find(p => p === prop);
        if (skipError === undefined) {
            let isError = false;
            if (payload[prop]?.length < 1 || payload[prop] === null) {
                isError = true;
                errors = [...errors, prop];
            }
            if (prop === 'email' && !isError && !checkEmailFormat(payload[prop])) {                
                errors = [...errors, 'invalid-format-email'];
            }
            if (prop === 'confirm_password' && !isError && (payload[prop] !== payload['password'])) {
                errors = [...errors, 'password-not-match'];
            }
        }
    });

    return errors;
};

const classNames = (...classes: any) => {
    return classes.filter(Boolean).join(' ')
};

const formatMoney = (number: number): string => {    
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const getToken = () => {
    const token = Cookies.get('token');
    headers.headers.authorization = `Bearer ${token}`;
};

const showToast = (type: string, message: string) => {    
    toast[type](message);
};

const formatDate = (number: number): string => {
    const date = new Date(number * 1000);
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'long' }).format(date);
};

export {
    hasError,
    checkEmailFormat,
    validate,
    classNames,
    formatMoney,
    getToken,
    showToast,
    formatDate
};