import React, { useEffect, useState } from 'react';
import s from './Pos.module.css'
import { Header, Layout } from '@components/common';
import { RefreshIcon, TrashIcon, PencilIcon } from '@heroicons/react/outline';
import { Card, FAB, Form, Loader, Modal, Tabs } from '@components/ui';
import { formatMoney, hasError, showToast, validate } from '@util/helper';
import { pos_type, status } from '@lib/constants';
import { Colors } from '@lib/colors';
import { create, list, update, deletePos } from 'services/pos';
import { CreatePosRequest, CreatePosResponse, ListPosRequest, ListPosResponse, UpdatePosRequest, UpdatePosResponse } from 'services/types/pos';

export default function Pos() { 
    const actionButton: JSX.Element[] = [
        <TrashIcon key={0} className="w-5 h-5"/>, 
        <PencilIcon key={1} className="w-5 h-5"/>
    ];

    const [posInflowList, setPosInflowList] = useState<ListPosResponse>(null);
    const [posOutflowList, setPosOutflowList] = useState<ListPosResponse>(null);
    const [queryPosInflow, setQueryPosInflow] = useState<ListPosRequest>({
        page: 1,
        limit: 10,
        type: 0
    });
    const [queryPosOutflow, setQueryPosOutflow] = useState<ListPosRequest>({
        ...queryPosInflow,
        type: 1
    });

    const [payload, setPayload] = useState<UpdatePosRequest | CreatePosRequest>({
        name: '',
        type: 0,
        color: ''
    });

    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
        list: false,
        create: false
    });
    const [posInflowNotFound, setPosInflowNotFound] = useState<boolean>(false);
    const [posOutflowNotFound, setPosOutflowNotFound] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [type, setType] = useState<number>(pos_type.inflow);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState<boolean>(false);
    const [action, setAction] = useState<string>('add');
    let colorList = [];
    for (let prop of Object.keys(Colors)) {
        colorList = [...colorList, Colors[prop]];
    };

    const form = [
        {
            label: 'Pos Name',
            name: 'name',
            type: 'text',
            data: [],
            colors: []
        },
        {
            label: 'Type',
            name: 'type',
            type: 'select',            
            data: [
                {
                    id: 0,
                    name: 'Inflow'
                },
                {
                    id: 1,
                    name: 'Outflow'
                }
            ],
            colors: []
        },
        {
            label: 'Color',
            name: 'color',
            type: 'color',
            data: [],
            colors: colorList
        }       
    ];

    useEffect(() => {                
        fetchData(queryPosInflow, false);
        return;
    }, []);

    const fetchData = async (q: ListPosRequest, afterUpsert: boolean = false) => {   
        const { setNotFound, dataList, setDataList } = getCurrentTabData(q.type);

        setLoading('list', true);                
        const newData = await list(q);
        if (newData.status === status.NotFound) {
            setNotFound(true);
            if (q.page === 1) {
                setDataList(null);
            }
            return
        }
        setLoading('list', false);

        if (afterUpsert) {
            if (dataList?.pos?.length > 10 && q.page > 1) {
                const currentPos = setPos(q.page - 1, dataList, newData);
                setDataList({
                    ...newData,
                    pos: [...currentPos]
                });
                return
            }
            setDataList({ ...newData });
        }

        if (dataList?.pos?.length > 0 && !afterUpsert) {
            const currentPos = setPos(q.page, dataList, newData);
            setDataList({
                ...newData,
                pos: [...currentPos]
            });

            setNotFound(false);
            return
        }
        setDataList(newData);
    };

    const upsert = async (p: CreatePosRequest | UpdatePosRequest) => {
        if (action === 'add') {
            const resp: CreatePosResponse = await create(p);
            return resp;
        }
        const resp: UpdatePosResponse = await update(p);
        return resp;

    };

    const doDeletePos = async (e) => {
        e.preventDefault();
        
        const param = { id: payload.id };
        const resp: any = await deletePos(param);
        if (resp.status === status.OK) {
            resetPayload();
            setModalDeleteVisible(false)            
            showToast('success', `Delete POS successfully`);
            const { currentQuery, posNotFound, setNotFound } = getCurrentTabData(payload.type);            
            if (posNotFound && currentQuery.page > 1) {
                currentQuery.page -= 1;
                setNotFound(false);
            }

            fetchData(currentQuery, true);
        }
    };

    const setPos = (page: number, dataList: ListPosResponse, data: ListPosResponse) => {
        const currentTotalData = page * 10;             
        dataList.pos = dataList.pos.slice(0, currentTotalData)            
        const currentPos = [...dataList.pos, ...data.pos];

        return currentPos;
    };

    const getCurrentTabData = (posType: number) => {
        const isInflow = posType === pos_type.inflow;
        return {
            posNotFound: isInflow ? posInflowNotFound : posOutflowNotFound,
            setNotFound: isInflow ? setPosInflowNotFound : setPosOutflowNotFound,
            currentQuery: isInflow ? queryPosInflow : queryPosOutflow,
            setQuery: isInflow ? setQueryPosInflow : setQueryPosOutflow,
            dataList: isInflow ? posInflowList : posOutflowList,
            setDataList: isInflow ? setPosInflowList : setPosOutflowList
        };
    };

    const resetPayload = () => {
        setPayload({
            name: '',
            type: 0,
            color: ''
        });
    };

    const setLoading = (loadingType: string, value: boolean) => {
        setIsLoading({
            ...isLoading,
            [loadingType]: value
        });
    };

    const _handleChange = (evt): void => {
        const value = evt?.field && evt.field === 'type' ? evt.id : evt.target.value;
        const name = evt?.field && evt.field === 'type' ? 'type' : evt.target.name;

        setPayload({ ...payload, [name]: value });
    };

    const _handleChangeTab = async (currentTab: number) => {
        const posType = currentTab - 1;
        const { dataList, currentQuery } = getCurrentTabData(posType);
        setType(posType);

        if (dataList?.pos?.length < 1 || !dataList) {
            await fetchData(currentQuery, true);
        }

    };

    const _handleSubmit = async (e): Promise<boolean> => {
        e.preventDefault();
        const errors = validate(payload);                      
        setErrorList(errors);
        if (errors.length > 0) { return false };

        const { posNotFound, setNotFound, currentQuery, setQuery } = getCurrentTabData(payload.type);

        const q = { ...currentQuery };
        if (posNotFound && q.page > 1) { 
            q.page = q.page - 1;
            setQuery({ ...q }); 
            setNotFound(false);
        }

        setLoading('create', true);   
        const p: any = {
            name: payload.name,
            type: payload.type,
            color: payload.color
        };
        
        if (action === 'edit') {
            p.id = payload.id;
        }

        const resp: CreatePosResponse | UpdatePosResponse = await upsert(payload);                
        setLoading('create', false);

        if (resp.status === status.Created || resp.status === status.OK) {
            const messageAction = action === 'add' ? 'Create' : 'Edit';
            setIsVisible(false);
            resetPayload();
            
            await fetchData(q, true);            
            showToast('success', `${messageAction} POS successfully`);
            return true
        } 
        
        showToast('error', resp.error);        
        return false;   
    };

    const _handleCloseButton = (isVisible: boolean) => {
        setIsVisible(isVisible);
        resetPayload();
    };

    const _handleLoadMoreData = async () => {
        const { setQuery, currentQuery } = getCurrentTabData(type);

        const q: ListPosRequest = {
            ...currentQuery,
            page: currentQuery.page + 1
        };

        setQuery({ ...q });
        await fetchData(q, false);
    };

    const _handleModalVisible = (visible: boolean, action: string, data?: CreatePosRequest) => {
        if (action === 'edit') {
            setPayload({ ...data })
        }
        if (action === 'delete') {
            setPayload({ ...data });
            setModalDeleteVisible(visible);
            return
        }
        setIsVisible(visible);
        setAction(action);
    };

    const RenderCashFlow = ({ data, notFound }) => (
        <div className={s.cardWrapper}>
            {notFound && (data === null || data.length < 1) 
            ? <>Data not found</>
            :
                data?.pos?.length > 0 
                
                ? 
                    data.pos.map((pos, key) => (
                    <Card color={pos.color} key={key}>
                        <div className={s.posIdentity}>
                            <div className={s.posName}>{pos.name}</div>
                            <div className={s.posTotal}>{formatMoney(pos.total)}</div>
                        </div>
                        <div className={s.actionButtonWrapper}>
                            {actionButton.map((ab, k) => (
                                <button 
                                    key={k} 
                                    className={`${s.wrapper} ${k !== actionButton.length - 1 && 'mr-3'}`}
                                    onClick={() => {                
                                        if (k === 0) {                                            
                                            return _handleModalVisible(!modalDeleteVisible, 'delete', pos);
                                        }
                                        _handleModalVisible(!isVisible, 'edit', pos);
                                    }}
                                >
                                    {ab}
                                </button>
                            ))}
                        </div>
                    </Card>
                    ))
                : <Loader height={50} count={5} className={"my-2"}/>
                }
                {!notFound && data?.pos?.length >= 10 && (
                    <div className={s.loadButtonWrapper}>
                        <button className={s.loadButton} onClick={_handleLoadMoreData}>
                            <RefreshIcon className="w-5 h-5"/>
                        </button>
                    </div>
                )}
            
        </div>
    );

    return (
        <Layout>
            
            <div className={s.container}>
                <Header title="Your POS"/>
                
                <div className={s.content}>
                    <Tabs 
                        tabs={[
                            <RenderCashFlow notFound={posInflowNotFound} data={posInflowList} key={0} />, 
                            <RenderCashFlow notFound={posOutflowNotFound} data={posOutflowList} key={1}/>
                        ]}
                        titles={['Inflow', 'Outflow']}
                        handleChangeTab={_handleChangeTab}
                        style={{
                            height: '100vh',
                            minHeight: 400
                        }}

                    />
                    <FAB onClick={(isVisible) => _handleModalVisible(isVisible, 'add')} visible={isVisible}/>
                    <Modal 
                        title={`${action} POS`} 
                        isVisible={isVisible}
                        handleCloseButton={_handleCloseButton} 
                        handleSubmit={_handleSubmit}
                        textSubmit={isLoading.create ? 'Loading' : 'Save changes'}
                        disabled={isLoading.create}
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

                    <Modal 
                        title="Delete POS" 
                        isVisible={modalDeleteVisible}
                        handleCloseButton={(visible) => setModalDeleteVisible(visible)} 
                        handleSubmit={doDeletePos}
                        textSubmit={isLoading.delete ? 'Loading' : 'Delete' }
                        disabled={isLoading.delete}
                    >
                        Are you sure?
                    </Modal>                        
                </div>                                        
            </div>

        </Layout>
    );
}