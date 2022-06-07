import { AppProps } from "next/app";
import { FC } from "react";
import AuthProvider, { ProtectRoute } from "context/auth";
import NProgress from 'nprogress';
import Router from 'next/router';
import "@assets/main.css";
import 'keen-slider/keen-slider.min.css';
import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', (url) => {
    NProgress.start();
});

Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps}: AppProps & { Component: { Layout: FC }}) {
    return (
        <AuthProvider>
            <ProtectRoute>
                <Component {...pageProps} />            
            </ProtectRoute>
        </AuthProvider>
    )
}

export default MyApp;