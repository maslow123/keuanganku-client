import { FC, ReactNode } from "react";
import style from './Layout.module.css';
import Head from "next/head";
import { BottomNavigation } from "../BottomNavigation";

interface Props {
    children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => {

    return (
        <>
            <Head>
                <link href="../../../../public/fonts/Poppins-Black.ttf"/>
            </Head>
            <div className={style.root}>                        
                <main className="fit">
                    { children }
                </main>
            </div>
            <BottomNavigation/> 
        </>
    )
}

export default Layout;