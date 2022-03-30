import { FC } from "react";
import { Container } from "@components/ui";
import Link from "next/link";
import s from "./Navbar.module.css";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

interface Props {
    title: string;
};

const Navbar: FC<Props> = ({ title }) => {
    const router = useRouter();
    const goBack = () => {
        router.back();
    };
    const logout = () => {
        Cookies.remove('token');
        router.push('/users/login');
    }
    return (
        <div className="bg-red">
            <Container>
                <div className={s.wrapper}>
                    <div className="flex flex-1 items-center">
                        {title === 'My Task' 
                            ? 'TODOAPP' 
                            : 
                            <Link href="#">
                                <a className={`${s.logo} font-bold tracking-widest`} onClick={goBack}>
                                    <ArrowLeftIcon className="w-5 h-5"/>
                                </a>
                            </Link>
                        }
                    </div>
                    <div className="flex flex-1 justify-center items-center tracking-widest">                    
                        <span>{title}</span>    
                    </div>
                    <div className="flex flex-1 justify-end space-x-8 pt-3">
                        <div 
                            className={s.image} 
                            onClick={logout}
                        >                    
                            <Image
                                src={'/images/avatar.png'}
                                objectFit="cover"
                                height={50}
                                width={50}
                                className="rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
};

export default Navbar;