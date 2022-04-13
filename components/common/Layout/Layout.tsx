import { FC, ReactNode } from "react";
import style from './Layout.module.css';
import Head from "next/head";

interface Props {
    children: ReactNode;
    title: string;
};

const Layout: FC<Props> = ({ children, title }) => {

    return (
        <>
            <Head>
                <link href="../../../../public/fonts/Poppins-Black.ttf"/>
            </Head>
            <div className={style.root}>                        
                <main 
                    className="fit"
                >
                    { children }
                </main>
            </div>
        </>
    )
}

export default Layout;