import React, { useEffect, useState } from 'react';
import { Layout } from '@components/common';
import s from './Pos.module.css'
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { Card, FAB, Form, Modal, Tabs } from '@components/ui';
import { mock } from '@util/mock';
import { formatMoney, hasError, validate } from '@util/helper';
import { pos_type } from '@lib/constants';
import { Colors } from '@lib/colors';
import { list } from 'services/pos';

export default function Pos() { 
    const [posList, setPosList] = useState<Record<string, any>[]>(null);
    const [payload, setPayload] = useState<Record<string, any>>({
        user_id: 0,
        name: '',
        type: '',
        color: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [type, setType] = useState<number>(pos_type.inflow);
    const [invalid, setInvalid] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const query = {
                page: 1,
                limit: 10
            };

            const data = await list(query);
            if (!data?.error) {
                console.log(data);
            }

            setPosList(data.pos);
        };

        fetchData();
        return;
    }, []);

    const _onGoBack = () => {
        router.back();
    };

    const renderCashFlow = () => (
        <>
            {posList?.length > 0 && posList.map((item, key) => (
                <Card color={item.color} key={key}>
                    <div className={s.posName}>{item.name}</div>
                    <div className={s.posTotal}>{formatMoney(item.total)}</div>
                    <div className={s.detailTransaction}>
                        <span className={s.detailTransactionText}>Detail transaction</span>
                    </div>
                </Card>
            ))}
        </>
    );

    const _handleChange = (evt): void => {
        const value = evt?.field && evt.field === 'type' ? evt.id : evt.target.value;
        const name = evt?.field && evt.field === 'type' ? 'type' : evt.target.name;

        setPayload({ ...payload, [name]: value });
    };

    const _handleSubmit = async (e): Promise<boolean> => {
        e.preventDefault();

        let error = '';
        const errors = validate(payload);        
        
        setErrorList(errors);
        if (errors.length > 0) { return false };
        setErrorMessage(error);
        

        if (error) { return false };
        return true;     
    };

    let colorList = [];
    for (let prop of Object.keys(Colors)) {
        colorList = [...colorList, Colors[prop]];
    }

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

    return (
        <Layout>
            <>
                <div className={s.header}>
                    <div className={classNames(s.wrapper, 'cursor-pointer')} onClick={_onGoBack}>
                        <ChevronLeftIcon className="w-5 h-5"/>
                    </div>
                    <div className={s.title}>
                        Your POS
                    </div>
                    
                    <div className={s.content}>
                        <Tabs 
                            tabs={[renderCashFlow(), renderCashFlow()]}
                            titles={['Inflow', 'Outflow']}
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
    )
}