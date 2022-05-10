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

export default function Dashboard() { 
    const [transactionList, setTransactionList] = useState<any>(null); 
    useEffect(() => {                
        fetchData();
        return;
    }, []);

    const fetchData = async () => {   
        const query = { page: 1, limit: 10 };
        const data = await list(query);

        if (data.status === status.OK) {
            setTransactionList(data.transaction);
        }
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
                            tabs={[<FirstTab key={0}/>]} 
                            titles={['Personal Balance', 'Savings']}
                            handleChangeTab={() => {}}
                        />
                        <div className="font-bold pb-3">
                            <span>Transaction</span>
                        </div>
                        <HistoryTransaction data={transactionList}/>
                    </>
                </div>

            </>
        </Layout>
    )
}