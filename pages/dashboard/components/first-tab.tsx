import { ClockIcon, TrendingUpIcon } from '@heroicons/react/outline';
import { formatMoney } from '@util/helper';
import classNames from 'classnames';
import Link from 'next/link';
import { ReactElement } from 'react';
import s from './../Dashboard.module.css';
import { transaction_type } from '@lib/constants';

const FirstTab = ({ balances }): ReactElement => {
    const items: Record<any, any> = [        
        {
            name: 'Transaction',
            icon: <TrendingUpIcon className="w-6 h-6 text-white"/>,
            cardColor: 'bg-sky-200',
            bgIcon: 'bg-sky-500',
            textColor: 'text-sky-500',
            href: 'transactions?showModal=true'
        },
        {
            name: 'History',
            icon: <ClockIcon className="w-6 h-6 text-white"/>,
            cardColor: 'bg-emerald-300',
            bgIcon: 'bg-emerald-500',
            textColor: 'text-emarald-500',
            href: 'transactions'
        }
    ];

    const totalBalance = (balances[0]?.total + balances[1]?.total) || 0;
    return (
        <>
            <div className={s.amount}>
                <span className={s.currency}>Rp. </span>
                <span className={s.balance}>{formatMoney(totalBalance, false)}</span>
            </div>            

            {balances?.length > 0 && balances.map((item, key) => (
                <div key={key}>
                    <label className='text-sm'>
                        <span className='font-bold'>{transaction_type[item.type]}</span>: 
                        <span className='pl-1'>{formatMoney(item.total)}</span>
                    </label>
                </div>
            ))}

            <div className={s.transactions}>
                {items.length > 0 && items.map((item, i) => (
                    <div className={`${s.section} ${item.cardColor} cursor-pointer`} key={i}>
                        <Link href={item.href}>                        
                            <div className={s.button}>
                                <div className={classNames(s.icon, item.bgIcon)}>
                                    {item.icon}
                                </div>
                                <div className={classNames(s.text, item.textColor)}>
                                    {item.name}
                                </div>
                            </div>
                        </Link>
                    </div>               
                ))}
            </div>
        </>
    )
};

export default FirstTab;