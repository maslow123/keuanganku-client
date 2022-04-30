import { Header, Layout } from "@components/common";
import { Tabs } from "@components/ui";
import { status } from "@lib/constants";
import { HistoryTransaction } from "pages/dashboard/components";
import { useEffect, useState } from "react";
import { list } from "services/transactions";
import s from './Transactions.module.css';

export default function Transaction() {   
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
        console.log(data);
    };
    return (
        <Layout>
            <div className={s.container}>
                <Header title="Transactions"/>
                <div className={s.content}>
                    <Tabs 
                        tabs={[
                            <HistoryTransaction key={0} data={transactionList} />, 
                            <HistoryTransaction key={1} data={transactionList}/>
                        ]}
                        titles={['Send', 'Receive']}
                        handleChangeTab={() => {}}
                        style={{
                            height: '100vh',
                            minHeight: 400
                        }}
                    />
                </div>
            </div>
        </Layout>
    )
};

