import Cookies from 'js-cookie';
const token = Cookies.get('token') || '';

export const headers = {
    headers: {
        authorization: `Bearer ${token}`
    }
};