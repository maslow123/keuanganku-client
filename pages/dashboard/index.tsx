import React, { useEffect, useState } from 'react';
import { Layout } from '@components/common';
import { images } from "@util/images";
import { LogoutIcon } from "@heroicons/react/outline";
import { Tabs } from '@components/ui';
import { FirstTab, HistoryTransaction } from './components';
import { detail, list } from 'services/transactions';
import { status } from '@lib/constants';
import { DetailTransactionResponse, ListTransactionRequest, ListTransactionResponse } from 'services/types/transactions';
import { user } from 'services/balance';
import { useAuth } from 'context/auth';
import { getPartOfDay, logout, showToast } from '@util/helper';
import { useRouter } from "next/router";
import Image from 'next/image';
import Cookies from 'js-cookie';
import s from './Dashboard.module.css';

export default function Dashboard() { 
    const router = useRouter();
    const ctx = useAuth();
    const [transactionList, setTransactionList] = useState<ListTransactionResponse>(null); 
    const [balanceList, setBalanceList] = useState<any>(null); 
    const [transactionNotFound, setTransactionNotFound] = useState<boolean>(false);
    const [_, setBalanceNotFound] = useState<boolean>(false);
    const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
    const [transactionDetail, setTransactionDetail] = useState<DetailTransactionResponse>();

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
    
    const detailTransaction = async (showDetail, transactionId) => {
        setDetailModalVisible(showDetail);
        if (transactionId) {
            const data = await detail(transactionId);        
            if (data.status !== status.OK) {
                showToast('error', data.error);
                return
            }

            setTransactionDetail(data);
        }

    };

    const logoutAccount = async () => {
        await logout(ctx, router);
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
                                Hi, {ctx?.user?.name}
                            </div>
                            <div className={s.greeting}>
                                Good {getPartOfDay()}
                            </div>
                        </div>
                    </div>
                    <div className={s.rightHeader}>                        
                        <div className={s.notificationButton} onClick={logoutAccount}>
                            <LogoutIcon className="w-6 h-6"/>
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
                                showDetail={detailModalVisible}
                                onShowDetail={detailTransaction}
                                transactionDetail={transactionDetail}
                            />
                        </div>
                    </>
                </div>

            </>
        </Layout>
    )
}