import { ChevronDownIcon, ChevronUpIcon, ClockIcon, TrendingUpIcon } from '@heroicons/react/outline';
import { formatMoney } from '@util/helper';
import { ReactElement } from 'react';
import { transaction_type } from '@lib/constants';
import { Loader, Tooltip } from '@components/ui';
import classNames from 'classnames';
import Link from 'next/link';
import s from './../Dashboard.module.css';

const renderText = (today_expenses, other_day_expenses, percentage): string => {
    if (percentage > 0) {
        return `Hemat sebesar ${formatMoney(other_day_expenses - today_expenses)} hari ini.`;
    } else if (percentage < 0) {
        return `Boros sebesar ${formatMoney(today_expenses - other_day_expenses)} hari ini.`;
    }

    return '';
};

const percentageColor = (percentage): string => {
    if (percentage < 0) {
        return 'text-orange-600';
    } else if (percentage > 0) {
        return 'text-green';
    } 
    return '';
};

const iconPercentage = (percentage): JSX.Element  => {
    if (percentage < 0) {
        return <ChevronDownIcon className="h-5 w-5"/>
    } else if (percentage > 0) {
        return <ChevronUpIcon className="h-5 w-5"/>
    } 
    return null;
};

const FirstTab = ({ balances, expenditure }): ReactElement => {
    let text = '';
    let textColor = '';
    let icon = null;
    if (expenditure) {
        const { today_expenses, other_day_expenses, percentage } = expenditure;
        text = renderText(today_expenses, other_day_expenses, percentage);
        textColor = percentageColor(percentage);
        icon = iconPercentage(percentage);
    }

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
            <div className={s.info}>
                <div className={s.amount}>
                    <span className={s.currency}>Rp. </span>
                    <span className={s.balance}>{
                        balances.length > 0
                        ? formatMoney(totalBalance, false) 
                        : <Loader count={1} width={100} />
                    }</span>                    
                </div>
                {expenditure?.percentage !== 0 && (
                    <Tooltip text={text}>
                        <div className={`${s.percentage} ${textColor}`}>
                            {icon}
                            <label className="px-2 text-xs">{expenditure?.percentage.toFixed(2) || 0}%</label>
                        </div>
                    </Tooltip>
                )}
            </div>
            
            {balances?.length > 0
            ? 
                balances.map((item, key) => (
                    <div key={key}>
                        <label className='text-sm'>
                            <span className='font-bold'>{transaction_type[item.type]}</span>: 
                            <span className='pl-1'>{formatMoney(item.total)}</span>
                        </label>
                    </div>
                ))
            : <Loader count={2} width={100} />
        }

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