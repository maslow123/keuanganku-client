import React, { useEffect, useState } from 'react';
import { Layout } from '@components/common';
import s from './Dashboard.module.css'
import Image from 'next/image';
import { images } from "@util/images";
import { CogIcon, BellIcon } from "@heroicons/react/outline";
import { Tabs } from '@components/ui';
import { FirstTab, HistoryTransaction } from './components';
import { list } from 'services/transactions';
import { status } from '@lib/constants';
import { ListTransactionRequest, ListTransactionResponse } from 'services/types/transactions';
import { user } from 'services/balance';

export default function Dashboard() { 
    const [transactionList, setTransactionList] = useState<ListTransactionResponse>(null); 
    const [balanceList, setBalanceList] = useState<any>(null); 
    const [transactionNotFound, setTransactionNotFound] = useState<boolean>(false);
    const [balanceNotFound, setBalanceNotFound] = useState<boolean>(false);
    useEffect(() => {                
        fetchTransactionData();
        fetchUserBalance();

        return;
    }, []);

    const fetchTransactionData = async () => {   
        const query: ListTransactionRequest = { page: 1, limit: 5, action: 0, startDate: 0, endDate: 0 };
        const data = await list(query);

        if (data.status === status.OK) {
            setTransactionList(data);
            return
        }
        setTransactionNotFound(true);
    };
    const fetchUserBalance = async () => {   
        const data = await user();
        if (data.status === status.OK) {
            setBalanceList(data.balances);
            return
        }
        setBalanceNotFound(true);
    };
    return (
        <Layout>
            <>
                <div className={s.headerWrapper}>
                    <div className={s.leftHeader}>
                        <div className={s.avatar}>
                            <Image
                                alt="avatar"
                                src={images.avatar}
                                layout="intrinsic"
                                quality={100}
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                        </div>
                        <div className={s.sectionName}>
                            <div className={s.name}>
                                Hi, Maslow
                            </div>
                            <div className={s.greeting}>
                                Selamat pagi
                            </div>
                        </div>
                    </div>
                    <div className={s.rightHeader}>
                        <div className={s.settingButton}>
                            <CogIcon className="w-6 h-6"/>
                        </div>
                        <div className={s.notificationButton}>
                            <BellIcon className="w-6 h-6"/>
                        </div>
                    </div>
                </div>
                <div className={s.tab}>
                    <>                    
                        <Tabs 
                            tabs={[<FirstTab key={0} balances={balanceList || []}/>]} 
                            titles={['Personal Balance']}
                            handleChangeTab={() => {}}
                        />
                        <div className={s.transactionWrapper}>
                            <div className="font-bold pb-3">
                                <span>Last today transactions: </span>
                            </div>
                            <HistoryTransaction 
                                data={transactionList?.transaction} 
                                isNotFound={transactionNotFound} 
                                handleLoadMoreData={() => {}}
                                onDelete={(transactionId) => console.log(transactionId)}
                            />
                        </div>
                    </>
                </div>

            </>
        </Layout>
    )
}