import { Header, Layout } from "@components/common";
import { FAB, Form, Modal, Tabs } from "@components/ui";
import { status } from "@lib/constants";
import { hasError, validate } from "@util/helper";
import { HistoryTransaction } from "pages/dashboard/components";
import { useEffect, useState } from "react";
import { list } from "services/transactions";
import { list as listPos } from "services/pos";
import s from './Transactions.module.css';
import { CreateTransactionRequest } from "services/types/transactions";

export default function Transaction() {   
    const [transactionList, setTransactionList] = useState<any>(null);
    const [payload, setPayload] = useState<CreateTransactionRequest>({
        pos_id: 0,
        total: 0,
        details: '',
        action_type: 1,
        type: 0
    });
    const [isLoading, setIsLoading] = useState<Record<any, any>>({
        fetchTransaction: true,
        fetchPos: true
    });
    const [errorList, setErrorList] = useState<string[]>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [form, setForm] = useState<Record<any, any>[]>([
        {
            label: 'Pos Name',
            name: 'pos_id',
            type: 'select',            
            data: [],
            colors: []
        },
        {
            label: 'Total',
            name: 'total',
            type: 'text',
            data: [],
            colors: []
        },  
        {
            label: 'Details',
            name: 'details',
            type: 'text',
            data: [],
            colors: []
        },  
        {
            label: 'Action',
            name: 'action_type',
            type: 'select',            
            data: [                
                {
                    id: 1,
                    name: 'SEND'
                },
                {
                    id: 0,
                    name: 'RECEIVE'
                }
            ],
            colors: []
        },
        {
            label: 'Method',
            name: 'type',
            type: 'select',            
            data: [
                {
                    id: 0,
                    name: 'CASH'
                },
                {
                    id: 1,
                    name: 'TRANSFER'
                }
            ],
            colors: []
        },
    ]);

    useEffect(() => {                
        fetchDataTransaction();
        fetchPos();
        return;
    }, []);

    const fetchDataTransaction = async () => {   
        const query = { page: 1, limit: 10 };
        const data = await list(query);
        setIsLoading({ ...isLoading, fetchTransaction: false });

        if (data.status === status.OK) {
            setTransactionList(data.transaction);
        }
    };
    
    const fetchPos = async () => {
        const query = { page: 1, limit: 10, type: 0 };
        const data = await listPos(query);

        setIsLoading({ ...isLoading, fetchPos: false });
        if (data.status === status.OK) {

            form[0].data = data.pos.map(item => { return { id: item.id, 'name': item.name } });
            setForm([ ...form ]);
        }
    };

    const _handleSubmit = async (e): Promise<boolean> => {
        e.preventDefault();
        const errors = validate(payload);                      
        setErrorList(errors);
        if (errors.length > 0) { return false };

        return true
    };

    const _handleCloseButton = (isVisible: boolean) => {
        setIsVisible(isVisible);
    };

    const _handleChange = (evt): void => {
        const value = evt?.field ? evt.id : evt.target.value;
        const name = evt?.field ? evt.field : evt.target.name;

        setPayload({ ...payload, [name]: value });
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
                <FAB onClick={setIsVisible} visible={isVisible} disabled={!isLoading.fetchTransaction && !isLoading.fetchPos}/>
                <Modal 
                    title={`Create Transaction`} 
                    isVisible={isVisible}
                    handleCloseButton={_handleCloseButton} 
                    handleSubmit={_handleSubmit}
                    textSubmit={'Save changes'}
                >
                    {form.map((item, key) => (
                        <Form
                            disabled={false}
                            key={key}
                            label={item.label}
                            name={item.name}
                            type={item.type}
                            value={payload[item.name]}
                            required
                            handleChange={_handleChange}
                            hasError={hasError(errorList, item.name)}  
                            list={item.type === 'select' && item.data}    
                            colors={item.type === 'color' && item.colors}                                  
                        />
                    ))}                                                                          
                </Modal>
            </div>
        </Layout>
    )
};

