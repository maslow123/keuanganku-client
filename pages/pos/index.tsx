import React, { useEffect, useState } from 'react';
import s from './Pos.module.css'
import classNames from 'classnames';
import { Layout } from '@components/common';
import { ChevronLeftIcon, RefreshIcon, TrashIcon, EyeIcon, PencilIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Card, FAB, Form, Modal, Tabs } from '@components/ui';
import { formatMoney, hasError, showToast, validate } from '@util/helper';
import { pos_type, status } from '@lib/constants';
import { Colors } from '@lib/colors';
import { create, list } from 'services/pos';
import { CreatePosRequest, CreatePosResponse, ListPosRequest, ListPosResponse } from 'services/types/pos';

export default function Pos() { 
    const actionButton: JSX.Element[] = [
        <TrashIcon key={0} className="w-5 h-5"/>, 
        <PencilIcon key={1} className="w-5 h-5"/>, 
        <EyeIcon key={2} className="w-5 h-5"/>
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

    const [payload, setPayload] = useState<CreatePosRequest>({
        name: '',
        type: 0,
        color: ''
    });
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
        list: false,
        create: false
    });
    const [notFound, setNotFound] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [type, setType] = useState<number>(pos_type.inflow);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const router = useRouter();
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

    const fetchData = async (q: ListPosRequest, afterInsert: boolean = false) => {   
        const setData = q.type === 0 ? setPosInflowList : setPosOutflowList;

        setLoading('list', true);                
        const data = await list(q);
        if (data.status === status.NotFound) {
            setNotFound(true);
            return
        }
        setLoading('list', false);
        if (afterInsert) {
            setData({ ...data });
        }
        if (posInflowList?.pos?.length > 0 && !afterInsert) {
            const currentPos = [...posInflowList.pos, ...data.pos]
            setData({
                ...data,
                pos: currentPos
            });

            setNotFound(false);

            return
        }
        setData(data);
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
        const isPosInflow = currentTab - 1 === pos_type.inflow;
        setType(currentTab - 1);
        if (isPosInflow) {
            if (posInflowList?.pos?.length <= 0 || !posInflowList) {
                await fetchData(queryPosInflow, true)
                return
            }            
        }
        if (posOutflowList?.pos?.length <= 0 || !posOutflowList) {
            await fetchData(queryPosOutflow, true);
        }
    };

    const _handleSubmit = async (e): Promise<boolean> => {
        e.preventDefault();
        const errors = validate(payload);      
                
        setErrorList(errors);
        if (errors.length > 0) { return false };

        setLoading('create', true);
        const resp: CreatePosResponse = await create(payload);                
        setLoading('create', false);

        if (resp.status === status.Created) {
            setIsVisible(false);
            resetPayload();
            showToast('success', 'Create POS successfully');
            fetchData(queryPosInflow, true);
            return true
        } 
        
        showToast('error', resp.error);        
        return false;   
    };

    const _handleLoadMoreData = async () => {
        const isPosInflow = type === pos_type.inflow;
        const setData = isPosInflow ? setQueryPosInflow : setQueryPosOutflow;
        const currentQuery = isPosInflow ? { ...queryPosInflow } : { ...queryPosOutflow };

        const q: ListPosRequest = {
            ...currentQuery,
            page: queryPosInflow.page + 1
        };

        setData({ ...q });
        await fetchData(q, false);
    };

    const _onGoBack = () => {
        router.back();
    };

    const RenderCashFlow = ({ data }) => (
        <div className={s.cardWrapper}>
            {notFound && queryPosInflow.page === 1 
            ? <>Data not found</>
            :
                data?.pos?.length > 0 && data.pos.map((item, key) => (
                    <Card color={item.color} key={key}>
                        <div className={s.posIdentity}>
                            <div className={s.posName}>{item.name}</div>
                            <div className={s.posTotal}>{formatMoney(item.total)}</div>
                        </div>
                        <div className={s.actionButtonWrapper}>
                            {actionButton.map((ab, k) => (
                                <div key={k} className={`${s.wrapper} ${k !== actionButton.length - 1 && 'mr-3'}`}>
                                    {ab}
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
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
            <>
                <div className={s.container}>
                    <div className={s.header}>
                        <div className={classNames(s.wrapper, 'cursor-pointer')} onClick={_onGoBack}>
                            <ChevronLeftIcon className="w-5 h-5"/>
                        </div>
                        <div className={s.title}>
                            Your POS
                        </div>
                    </div>
                    
                    <div className={s.content}>
                        <Tabs 
                            tabs={[
                                <RenderCashFlow data={posInflowList} key={0} />, 
                                <RenderCashFlow data={posOutflowList} key={1}/>
                            ]}
                            titles={['Inflow', 'Outflow']}
                            handleChangeTab={_handleChangeTab}

                        />
                        <FAB onClick={setIsVisible} visible={isVisible}/>
                        <Modal 
                            title={"Add POS"} 
                            onClick={setIsVisible} 
                            isVisible={isVisible}
                            _handleSubmit={_handleSubmit}
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
                </div>

            </>
        </Layout>
    );
}