import { Header, Layout } from "@components/common";
import { Datepicker, FAB, Form, Modal, Tabs } from "@components/ui";
import { status, transaction_action } from "@lib/constants";
import { formatDate, formatMoney, getPDFTitle, hasError, showToast, validate } from "@util/helper";
import { HistoryTransaction } from "@components/dashboard";
import { useEffect, useState } from "react";
import { create, deleteTransaction, detail, list } from "services/transactions";
import { list as listPos } from "services/pos";
import { CreateTransactionRequest, DetailTransactionResponse, ListTransactionRequest, ListTransactionResponse } from "services/types/transactions";
import { useRouter } from "next/router";
import s from './Transactions.module.css';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDF } from "@components/transactions";
import { ToastOptions } from "react-toastify";

export default function Transaction() {   
    const router = useRouter();
    const [transactionInflowList, setTransactionInflowList] = useState<ListTransactionResponse>(null);
    const [transactionOutflowList, setTransactionOutflowList] = useState<ListTransactionResponse>(null);
    const [queryTransactionInflow, setQueryTransactionInflow] = useState<ListTransactionRequest>({ 
        page: 1, 
        limit: 10, 
        action: 0,
        startDate: 0,
        endDate: 0,
    });
    const [queryTransactionOutflow, setQueryTransactionOutflow] = useState<ListTransactionRequest>({ 
        ...queryTransactionInflow, 
        action: 1 
    });
    
    const [inserted, setInserted] = useState<number>(0);
    const [payload, setPayload] = useState<CreateTransactionRequest>({
        pos_id: null,
        total: 0,
        details: '',
        action_type: null,
        type: null,
        date: new Date().getTime()
    });
    const [transactionInflowNotFound, setTransactionInflowNotFound] = useState<boolean>(false);
    const [transactionOutflowNotFound, setTransactionOutflowNotFound] = useState<boolean>(false);

    const [action, setAction] = useState<number>(transaction_action.inflow);

    const [isLoading, setIsLoading] = useState<Record<any, any>>({
        fetchTransaction: true,
        fetchPos: true,
        createTransaction: false,
        deleteTransaction: false
    });
    const [errorList, setErrorList] = useState<string[]>(null);
    const [isVisible, setIsVisible] = useState<boolean>(Boolean(router?.query?.showModal) || false);
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
            type: 'number',
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
        {
            label: 'Date',
            name: 'date',
            type: 'date',            
            data: [],
            colors: []
        },
    ]);
    const [dateModalVisible, setDateModalVisible] = useState<boolean>(false);    
    const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
    const [transactionDetail, setTransactionDetail] = useState<DetailTransactionResponse>();    
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {                
        const fetchDataTransactionAndPos = async () => {
            const getStateLoadingAfterFetchPos = await fetchPos();            
            await fetchDataTransaction(getStateLoadingAfterFetchPos, queryTransactionInflow, false);
            setIsClient(true);
        };

        fetchDataTransactionAndPos();
    }, []);

    const fetchDataTransaction = async (
        currentStateLoading: any, 
        q: ListTransactionRequest, 
        afterInsert: boolean = false,
        reset: boolean = false
    ) => {                
        const { setNotFound, dataList, setDataList, currentQuery, setQuery } = getCurrentTabData(q.action);        
        q.page = afterInsert ? 1 : q.page;

        const data = await list(q);
        setIsLoading({ ...currentStateLoading, fetchTransaction: false });

        if (data.status === status.NotFound) {
            setNotFound(true);
            if (q.page === 1) {
                setDataList(null);
                setQuery({
                    ...q,
                    page: 1, 
                    limit: 10, 
                });                
            }
            return
        }

        if (reset) {
            
            setQuery({
                ...q,
                page: 1, 
                limit: 10, 
            });
            setDataList({ ...data });
            setNotFound(false);
            return
        }

        if (afterInsert) {
            if (dataList?.transaction?.length > 10 && !currentQuery.startDate) {
                const currentTransaction = setTransaction(q.page, dataList, data, afterInsert);
                setDataList({
                    ...data,
                    transaction: [...currentTransaction]
                });
                return
            }

            if (currentQuery.startDate > 0) {
                q.page = 1;
                setQuery({ ...q });
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
        const query = { page: 1, limit: 100, type: 2 };
        const data = await listPos(query);

        const currentLoading = { ...isLoading, fetchPos: false };
        if (data.status === status.OK) {
            form[0].data = data.pos.map(item => { return { id: item.id, 'name': item.name } });
            setForm([ ...form ]);
        }
        if (data.status === status.NotFound) {
            const config: ToastOptions = {
                closeOnClick: true,
                autoClose: 2000,
                onClose: () => {
                    router.push('/pos');
                }
            };
            showToast('error', 'Harap buat POS terlebih dahulu', config);
            return
        }
        return currentLoading
    };

    const resetPayload = () => {
        setPayload({
            pos_id: 0,
            total: 0,
            details: '',
            action_type: 1,
            type: 0,
            date: new Date().getTime()
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

    const onDeleteTransaction = async (transactionId: number) => {
        setIsLoading({ ...isLoading, deleteTransaction: true });
        const data = await deleteTransaction(transactionId);        
        if (data.status !== status.OK) {
            showToast('error', data.error);
            return
        }
        setIsLoading({ ...isLoading, deleteTransaction: true });
        showToast('success', 'Data successfully deleted');
        const { dataList, setDataList } = getCurrentTabData(action);
        dataList.transaction = dataList.transaction.filter(item => item.id !== transactionId);
        setDataList({ ...dataList });        
    };

    const _handleSubmit = async (e): Promise<boolean> => {
        e.preventDefault();
        const errors = validate(payload);                      
        setErrorList(errors);
        if (errors.length > 0) { return false };

        const { transactionNotFound, setNotFound, currentQuery } = getCurrentTabData(payload.action_type);

        const q = { ...currentQuery, startDate: 0, endDate: 0 };
        if (transactionNotFound && q.page > 1) {             
            setNotFound(false);
        }
        
        setIsLoading({ ...isLoading, createTransaction: true });
        const resp = await create(payload);
        if (resp.status === status.Created) {
            setInserted(inserted + 1);
            showToast('success', 'Create transaction successfully');
            setIsVisible(false);
            resetPayload();
            fetchDataTransaction(isLoading, q, true, false);
        }        
        setIsLoading({ ...isLoading, createTransaction: false });

        return true;
    };

    const _handleCloseButton = (isVisible: boolean) => {
        setIsVisible(isVisible);
    };

    const _handleChange = (evt): void => {
        let value = evt?.field ? evt.id : evt?.target?.value;
        const name = evt?.field ? evt.field : evt.target.name;

        switch(name) {
            case 'total':
            case 'action_type':
            case 'type':
                value = Number(value);
                break;
            default:
                break;
        }

        setPayload({ ...payload, [name]: value });
    };

    const _handleLoadMoreData = async () => {
        const { setQuery, currentQuery } = getCurrentTabData(action);

        const q: ListTransactionRequest = {
            ...currentQuery,
            page: currentQuery.page + 1,
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

    const _handleSubmitDate = (dateSelection: Record<string, any>, currentDateModalVisible: boolean, isSubmit: boolean = false) => {
        setDateModalVisible(currentDateModalVisible);
        const { currentQuery } = getCurrentTabData(action);
        const q = { 
            page: 1, 
            limit: 10, 
            action: currentQuery.action,
            startDate: Math.floor(dateSelection.startDate.getTime() / 1000),
            endDate: Math.floor(dateSelection.endDate.getTime() / 1000),            
        };

        if (isSubmit) {
            fetchDataTransaction(isLoading, q, false, true);
        }
    };

    const _renderTextTotalTransaction = (act) => {
        const { currentQuery, dataList } = getCurrentTabData(act);
        const { startDate, endDate } = currentQuery;

        let text = 'Today';

        if (startDate > 0 && endDate > 0) {
            text = `${formatDate(startDate, false)} - ${formatDate(endDate, false)}`;
            if (startDate === endDate) {
                text = `${formatDate(startDate, false)}`;    
            }
        }    
        const title = !action ? 'income' : 'outcome';    
        return (
            <label className="">
                Total {title} on {text}
                <br/><span className="font-bold"> {formatMoney(dataList?.total_transaction || 0)}</span>
            </label>
        );
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

    const documents = [
        {
            label: 'PDF',
            onClick: (url: string) => {}
        }
    ];

    const pdfTitle = (isFilename: boolean) => {
        const { currentQuery } = getCurrentTabData(action);
        let { startDate, endDate } = currentQuery;
        startDate = startDate === 0 ? Math.floor(new Date().getTime() / 1000) : startDate;
        endDate = endDate === 0 ? Math.floor(new Date().getTime() / 1000) : endDate;

        const currentDate = new Date().getTime();
        let text = getPDFTitle(currentDate);

        let conjunction = ' to ';
        if (isFilename) {
            conjunction = '-';
        }

        const formatStartDate = isFilename ? getPDFTitle(startDate) : formatDate(startDate, false);
        const formatEndDate = isFilename ? getPDFTitle(endDate) : formatDate(endDate, false);

        text = `${formatStartDate}${conjunction}${formatEndDate}`;
        if (getPDFTitle(startDate) === getPDFTitle(endDate)) {
            text =  formatStartDate;    
        }
           
        const type = action ? 'OUTCOME' : 'INCOME';
        
        let title = text;
        if (isFilename) {
            title = `${type} ${text}`;
        }

        return title;
    };

    return (
        <Layout>
            <div className={s.container}>
                <Header title="Transactions"/>
                <div className={s.content}>
                    <div className={s.header}>
                        <div className={s.total}>
                            {_renderTextTotalTransaction(action)}
                        </div>
                        <div className={s.date}>
                            <Datepicker visible={dateModalVisible} _handleSubmit={_handleSubmitDate}/>   
                            <div className={s.row}>
                                {isClient && documents.map((doc, key) => (
                                    <PDFDownloadLink 
                                        key={key}                    
                                        document={
                                            <PDF 
                                                action={action}
                                                title={pdfTitle(false)}
                                                data={
                                                    action === transaction_action.inflow
                                                    ? transactionInflowList
                                                    : transactionOutflowList
                                                }
                                            />
                                        } 
                                        fileName={`${pdfTitle(true)}.pdf`}
                                    >
                                        {({ loading, url }) => (
                                            loading 
                                            ? 'Loading document...' 
                                            : (
                                                <div 
                                                    key={key} 
                                                    className={`${s.iconButton} ${key === 0 && 'mx-2'}`}
                                                    onClick={() => doc.onClick(url)}
                                                >
                                                    <span className="text-xs">{doc.label}</span>
                                                </div>            
                                            )
                                        )}
                                    </PDFDownloadLink>
                                    
                                ))}
                            </div>         
                        </div>
                    </div>
                    <Tabs 
                        tabs={[
                            <HistoryTransaction 
                                key={0} 
                                data={transactionInflowList?.transaction} 
                                isNotFound={transactionInflowNotFound}
                                handleLoadMoreData={_handleLoadMoreData}
                                onDelete={onDeleteTransaction}
                                showDetail={detailModalVisible}
                                onShowDetail={detailTransaction}
                                transactionDetail={transactionDetail}
                            />, 
                            <HistoryTransaction 
                                key={1} 
                                data={transactionOutflowList?.transaction} 
                                isNotFound={transactionOutflowNotFound}
                                handleLoadMoreData={_handleLoadMoreData}
                                onDelete={onDeleteTransaction}
                                showDetail={detailModalVisible}
                                onShowDetail={detailTransaction}          
                                transactionDetail={transactionDetail}                  
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
                    textSubmit={isLoading.createTransaction ? 'Loading' : 'Save changes'}
                    scrollview={true}
                    disabled={isLoading.createTransaction}
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

