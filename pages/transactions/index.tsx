import { Header, Layout } from "@components/common";
import { FAB, Form, Modal, Tabs } from "@components/ui";
import { status, transaction_action } from "@lib/constants";
import { hasError, showToast, validate } from "@util/helper";
import { HistoryTransaction } from "pages/dashboard/components";
import { useEffect, useState } from "react";
import { create, list } from "services/transactions";
import { list as listPos } from "services/pos";
import s from './Transactions.module.css';
import { CreateTransactionRequest, ListTransactionRequest, ListTransactionResponse } from "services/types/transactions";

export default function Transaction() {   
    const [transactionInflowList, setTransactionInflowList] = useState<ListTransactionResponse>(null);
    const [transactionOutflowList, setTransactionOutflowList] = useState<ListTransactionResponse>(null);
    const [queryTransactionInflow, setQueryTransactionInflow] = useState<ListTransactionRequest>({ 
        page: 1, 
        limit: 10, 
        action: 0 
    });
    const [queryTransactionOutflow, setQueryTransactionOutflow] = useState<ListTransactionRequest>({ 
        ...queryTransactionInflow, 
        action: 1 
    });
    const [payload, setPayload] = useState<CreateTransactionRequest>({
        pos_id: 0,
        total: 0,
        details: '',
        action_type: null,
        type: null
    });
    const [transactionInflowNotFound, setTransactionInflowNotFound] = useState<boolean>(false);
    const [transactionOutflowNotFound, setTransactionOutflowNotFound] = useState<boolean>(false);

    const [action, setAction] = useState<number>(transaction_action.inflow);

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
            type: 'radio',            
            data: [                
                {
                    id: 1,
                    name: 'OUTFLOW'
                },
                {
                    id: 0,
                    name: 'INFLOW'
                }
            ],
            colors: []
        },
        {
            label: 'Payment Method',
            name: 'type',
            type: 'radio',            
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
    const [inserted, setInserted] = useState<number>(0);

    useEffect(() => {                
        const fetchDataTransactionAndPos = async () => {
            const getStateLoadingAfterFetchPos = await fetchPos();            
            await fetchDataTransaction(getStateLoadingAfterFetchPos, queryTransactionInflow, false);
        };

        fetchDataTransactionAndPos();
    }, []);

    const fetchDataTransaction = async (currentStateLoading: any, q: ListTransactionRequest, afterInsert: boolean = false) => {                
        const { setNotFound, dataList, setDataList } = getCurrentTabData(q.action);
        if (afterInsert) {
            q.page = 1;
        }
        const data = await list(q);
        setIsLoading({ ...currentStateLoading, fetchTransaction: false });

        if (data.toString() === 'transaction-not-found') {
            setNotFound(true);
            if (q.page === 1) {
                setDataList(null);
            }
            return
        }

        if (afterInsert) {
            if (dataList?.transaction?.length > 10) {
                const currentTransaction = setTransaction(q.page, dataList, data, afterInsert);
                setDataList({
                    ...data,
                    transaction: [...currentTransaction]
                });
                return
            }
            setDataList({ ...data });
        }
        
        if (dataList?.transaction?.length > 0 && !afterInsert) {
            const currentTransaction = setTransaction(q.page, dataList, data);
            setDataList({
                ...data,
                transaction: [...currentTransaction]
            });

            setNotFound(false);
            return
        }

        setDataList(data);
    };
    
    const fetchPos = async () => {
        const query = { page: 1, limit: 10, type: 0 };
        const data = await listPos(query);

        const currentLoading = { ...isLoading, fetchPos: false };
        if (data.status === status.OK) {

            form[0].data = data.pos.map(item => { return { id: item.id, 'name': item.name } });
            setForm([ ...form ]);
        }
        return currentLoading
    };

    const resetPayload = () => {
        setPayload({
            pos_id: 0,
            total: 0,
            details: '',
            action_type: 1,
            type: 0
        });
    };

    const setTransaction = (page: number, dataList: ListTransactionResponse, data: ListTransactionResponse, afterInsert: boolean = false) => {
        const currentTotalData = page * 10;     
        let currentTransaction = [];

        if (afterInsert) {                        
            dataList.transaction = dataList.transaction.slice(currentTotalData - 1); 
            currentTransaction = [...data.transaction, ...dataList.transaction];
            return currentTransaction;
        } 

        let removeIndex = dataList.transaction.length - inserted;
        if (page === 2 && inserted > 0) {
            removeIndex = dataList.transaction.length;
        }
        dataList.transaction = dataList.transaction.slice(0, removeIndex);
        if (inserted != 0) {
            setInserted(inserted - 1);
        }
        
        currentTransaction = [...dataList.transaction, ...data.transaction];
        return currentTransaction

    };

    const getCurrentTabData = (transactionAction: number) => {
        const isInflow = transactionAction === transaction_action.inflow;
        return {
            transactionNotFound: isInflow ? transactionInflowNotFound : transactionOutflowNotFound,
            setNotFound: isInflow ? setTransactionInflowNotFound : setTransactionOutflowNotFound,
            currentQuery: isInflow ? queryTransactionInflow : queryTransactionOutflow,
            setQuery: isInflow ? setQueryTransactionInflow : setQueryTransactionOutflow,
            dataList: isInflow ? transactionInflowList : transactionOutflowList,
            setDataList: isInflow ? setTransactionInflowList : setTransactionOutflowList
        };
    };

    const _handleSubmit = async (e): Promise<boolean> => {
        e.preventDefault();
        const errors = validate(payload);                      
        setErrorList(errors);
        if (errors.length > 0) { return false };

        const { transactionNotFound, setNotFound, currentQuery, setQuery } = getCurrentTabData(payload.action_type);

        const q = { ...currentQuery };
        if (transactionNotFound && q.page > 1) {             
            setNotFound(false);
        }

        const resp = await create(payload);
        if (resp.status === status.Created) {
            setInserted(inserted + 1);
            showToast('success', 'Create transaction successfully');
            setIsVisible(false);
            resetPayload();
            fetchDataTransaction(isLoading, q, true);
        }

        return true;
    };

    const _handleCloseButton = (isVisible: boolean) => {
        setIsVisible(isVisible);
    };

    const _handleChange = (evt): void => {
        let value = evt?.field ? evt.id : evt.target.value;
        const name = evt?.field ? evt.field : evt.target.name;

        if (name === 'total' || name === 'action_type' || name === 'type') {
            value = Number(value);
        }

        setPayload({ ...payload, [name]: value });
    };

    const _handleLoadMoreData = async () => {
        const { setQuery, currentQuery } = getCurrentTabData(action);

        const q: ListTransactionRequest = {
            ...currentQuery,
            page: currentQuery.page + 1
        };

        setQuery({ ...q });
        await fetchDataTransaction(isLoading, q, false);

    };

    const _handleChangeTab = async (currentTab: number) => {
        const transactionAction = currentTab - 1;
        const { dataList, currentQuery } = getCurrentTabData(transactionAction);
        setAction(transactionAction);

        if (dataList?.transaction?.length < 1 || !dataList) {
            await fetchDataTransaction(isLoading, currentQuery, false);
        }
    };

    return (
        <Layout>
            <div className={s.container}>
                <Header title="Transactions"/>
                <div className={s.content}>
                    <Tabs 
                        tabs={[
                            <HistoryTransaction 
                                key={0} 
                                data={transactionInflowList?.transaction} 
                                isNotFound={transactionInflowNotFound}
                                handleLoadMoreData={_handleLoadMoreData}
                            />, 
                            <HistoryTransaction 
                                key={1} 
                                data={transactionOutflowList?.transaction} 
                                isNotFound={transactionOutflowNotFound}
                                handleLoadMoreData={_handleLoadMoreData}
                            />
                        ]}
                        titles={['Inflow', 'Outflow']}
                        handleChangeTab={_handleChangeTab}
                        style={{
                            height: '100vh',
                            minHeight: 400
                        }}
                    />
                </div>                
                <FAB 
                    onClick={setIsVisible} 
                    visible={isVisible} 
                    disabled={isLoading.fetchTransaction || isLoading.fetchPos}
                />
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
                            list={(item.type === 'select' || item.type === 'radio') && item.data}    
                            colors={item.type === 'color' && item.colors}                                  
                        />
                    ))}                                                                          
                </Modal>
            </div>
        </Layout>
    )
};

