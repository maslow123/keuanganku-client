import { FC } from "react";
import { classNames } from "@util/helper";
import s from './Header.module.css'
import { ChevronLeftIcon } from "@heroicons/react/outline";
import Router from "next/router";

interface Props {
    title: string;
};

const onGoBack = () => {
    Router.back();
};

const Header: FC<Props> = ({ title }) => {

    return (
        <div className={s.header}>
            <div className={classNames(s.chevronIcon, 'cursor-pointer')} onClick={onGoBack}>
                <ChevronLeftIcon className="w-5 h-5"/>
            </div>
            <div className={s.title}>
                {title}
            </div>
        </div>
    );
}

export default Header;