import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { useRouter } from 'next/router';

const AuthContext = createContext({});

export default function AuthProvider({ children }) {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [splashScreen, setSplashScreen] = useState(false);
    
    useEffect(() => {
        async function loadUserFromCookies() {            
            const token = Cookies.get('token');
            const userCookie = Cookies.get('user');
            let userData = {};
            if (userCookie) {
                userData = JSON.parse(userCookie);
            }

            if (token) {                
                if (userData) {
                    setUser(userData);
                    router.push('/dashboard');
                    return
                }
            }
            setLoading(false);
            if (user?.error || !token) {
                router.push('/login', null, { shallow: true });                
                return;
            }            
        }
        loadUserFromCookies();
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, setUser, loading, splashScreen, setSplashScreen }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth: any = () => useContext(AuthContext);

export const ProtectRoute = ({ children }) => {    
    const router = useRouter();
    const noAuthPage = ['/login', '/register'];

    const { isAuthenticated, loading } = useAuth();
    if (typeof window !== undefined) {        
        const currentPageNoAuth = noAuthPage.includes(router.pathname); 
        if (loading || (!isAuthenticated && !currentPageNoAuth)){
          <>Loading...</>
        }
    }
    return children;
};