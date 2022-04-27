import { FC, ReactNode, useState } from "react";
import { classNames } from '@util/helper';
import s from './Tabs.module.css';

interface Props {
    titles: string[];
    tabs: ReactNode[];
    handleChangeTab: Function;
};

const Tabs:FC<Props> = ({ tabs, titles, handleChangeTab }) => {
    const [openTab, setOpenTab] = useState(1);
    return (
        <div className="flex flex-wrap mt-4">
            <div>
                <ul
                    className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                    role="tablist"
                >
                    {titles.map((item, key) => (
                        <>
                            <li className={`flex-auto text-center ${key !== item.length - 1 && 'pr-3'}`}>
                                <a
                                    className={
                                    "leading-normal " +
                                    (openTab === (key + 1)
                                        ? "text-blue-theme font-bold"
                                        : "text-gray-500 bg-white")
                                    }
                                    onClick={e => {
                                        e.preventDefault();
                                        setOpenTab(key + 1);
                                        handleChangeTab(key + 1);
                                    }}
                                    data-toggle="tab"
                                    href="#link1"
                                    role="tablist"
                                >
                                    {item}
                                </a>
                            </li>
                        </>
                    ))}
                </ul>
            </div>
            <div className={s.contentWrapper}>              
                {tabs.map((item, key) => (
                    <div key={key} className={`${classNames(s.content, openTab === (key + 1) ? 'block' : 'hidden')}`} id="link1">
                        {item}
                    </div>                    
                ))}
            </div>
        </div>
    );
};

export default Tabs;