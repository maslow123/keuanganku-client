import { AppProps } from "next/app";
import { FC } from "react";
import "@assets/main.css";
import 'keen-slider/keen-slider.min.css';
import AuthProvider, { ProtectRoute } from "context/auth";

const Noop: FC = ({ children }) => <>{children}</>;

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