import { ArrowCircleUpIcon, ArrowCircleDownIcon, ClockIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { FC, ReactElement } from 'react';
import s from './../Dashboard.module.css';

const FirstTab:FC = (): ReactElement => {
    const items: Record<any, any> = [
        {
            name: 'Send',
            icon: <ArrowCircleUpIcon className="w-6 h-6 text-white"/> ,
            cardColor: 'bg-blue',
            bgIcon: 'bg-blue-theme',
            textColor: 'text-blue-theme'
            
        },
        {
            name: 'Receive',
            icon: <ArrowCircleDownIcon className="w-6 h-6 text-white"/>,
            cardColor: 'bg-sky-200',
            bgIcon: 'bg-sky-500',
            textColor: 'text-sky-500'
        },
        {
            name: 'History',
            icon: <ClockIcon className="w-6 h-6 text-white"/>,
            cardColor: 'bg-emerald-300',
            bgIcon: 'bg-emerald-500',
            textColor: 'text-emarald-500'
        }
    ];
    return (
        <>
            <div className={s.amount}>
                <span className={s.currency}>Rp. </span>
                <span className={s.balance}>5.000.000</span>
            </div>

            <div className={s.transactions}>
                {items.length > 0 && items.map((item, i) => (
                    <div className={`${s.section} ${item.cardColor}`} key={i}>
                        <div className={s.button}>
                            <div className={classNames(s.icon, item.bgIcon)}>
                                {item.icon}
                            </div>
                            <div className={classNames(s.text, item.textColor)}>
                                {item.name}
                            </div>
                        </div>
                    </div>               
                ))}
            </div>
        </>
    )
};

export default FirstTab;