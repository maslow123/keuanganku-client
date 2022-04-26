import { HomeIcon, CreditCardIcon, CogIcon, ServerIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import s from './BottomNavigation.module.css';


const BottomNavigation: FC<any> = () => {
    const router = useRouter();
    const routes = [
        {
            name: 'Home',
            route: '/dashboard',
            icon: <HomeIcon className="h-5 w-5"/>
        },
        {
            name: 'Pos',
            route: '/pos',
            icon: <ServerIcon className="h-5 w-5"/>
        },
        {
            name: 'Transactions',
            route: '/transactions',
            icon: <CreditCardIcon className="h-5 w-5"/>
        },
        {
            name: 'Settings',
            route: '/settings',
            icon: <CogIcon className="h-5 w-5"/>
        }
    ]
    return (
        <div className={s.wrapper}>
           <div className={s.container}>
               {routes.map((item, i) => (
                    <Link href={item.route} key={i}>
                        <div className={classNames(s.section, 'cursor-pointer')}>
                            <div className={classNames(s.icon, router.pathname === item.route ? 'text-white' : 'text-gray-400')}>
                                <span>{item.icon}</span>
                            </div>
                            <div className={classNames(s.route, router.pathname === item.route ? 'text-white' : 'text-gray-400')}>
                                <span>{item.name}</span>
                            </div>
                        </div>               
                    </Link>
               ))}
           </div>
        </div>
    )
}

export default BottomNavigation;