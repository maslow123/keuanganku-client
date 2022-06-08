import React, { useState } from 'react';
import { Header, Layout } from "@components/common";
import { PencilIcon, KeyIcon, IdentificationIcon, LogoutIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { images } from "@util/images";
import { Card, Form } from "@components/ui";
import { useAuth } from "context/auth";
import s from "./Settings.module.css";
import { useRouter } from "next/router";
import { hasError, logout, showToast, validate } from "@util/helper";
import { Modal } from "@components/ui";
import { status } from '@lib/constants';
import updateUser from 'services/users/update';
import { UpdateRequest } from 'services/types/users';


export default function Settings() { 
    const ctx = useAuth();
    const router = useRouter();
    const cards = [
        {
            icon: <KeyIcon className="w-6 h-6"/>,
            title: 'Password',
            subTitle: 'Change password settings',
            onClick: () => console.log('clicked')
        },
        {
            icon: <IdentificationIcon className="w-6 h-6"/>,
            title: 'Privacy',
            subTitle: 'Change privacy settings',
            onClick: () => console.log('clicked')
        },
        {
            icon: <LogoutIcon className="w-6 h-6"/>,
            title: 'Logout',
            subTitle: '',
            onClick: async () => {
                await logout(ctx, router);
            }
        }
    ];

    const form = [
        {
            label: 'Nama',
            name: 'name',
            type: 'text'
        },
        {
            label: 'Email',
            name: 'email',
            type: 'text'
        }        
    ];

    const [payload, setPayload] = useState<UpdateRequest>({
        name: ctx?.user?.name,
        email: ctx?.user?.email
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [invalidEmailFormat, setInvalidEmailFormat] = useState<boolean>(false);


    const _handleSubmit = async (e) => {
        e.preventDefault();
        setInvalidEmailFormat(false);

        let error = '';
        const errors = validate(payload);
        const invalidEmail = errors.find(err => err === 'invalid-format-email');
        if (invalidEmail) {
            setInvalidEmailFormat(true);
        }        
        
        setErrorList(errors);
        if (errors.length > 0) { return false };
        
        setIsLoading(true);
        const resp: any = await updateUser(payload);
        setIsLoading(false);

        let isValid = false;
        if (resp.status !== status.OK) {
            isValid = true;
            error = resp.error;
        }
        if (error) { return false };

        showToast('success', 'Data sucessfully edited');
        setVisible(!visible);

        ctx.setUser({
            ...ctx.user,
            ...payload
        });

        return true;   
    };
    const _handleChange = (evt): void => {
        const value = evt.target.value;
        const name = evt.target.name;

        setPayload({ ...payload, [name]: value });
    };

    return (
        <Layout>            
            <Header title="Settings"/>
            <div className={s.container}>
                <div className={s.user}>
                    <div className={s.row}>
                        <div className={s.profile}>
                        <div className={s.avatar}>
                                <Image
                                    alt="avatar"
                                    src={images.avatar}
                                    layout="intrinsic"
                                    quality={100}
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                        </div>
                        <span className={s.username}>
                                {ctx?.user?.name}
                        </span>
                        <span className={s.email}>
                                {ctx?.user?.email}
                        </span>
                        </div>
                        <div 
                            className={`${s.row} items-center cursor-pointer`}
                            onClick={() => {
                                setVisible(!visible);
                            }}
                        >
                            <div className={`${s.row} ${s.editButton}`}>
                                <PencilIcon className="w-4 h-6 mr-2"/>
                                <span className={s.editText}>Edit profile</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={s.container}>
                    {cards.map((c, key) => (
                        <Card key={key} color="rgb(243 244 246 / 1)">
                            <div 
                                className={`${s.row} ${s.card}`}
                                onClick={c.onClick}
                            >
                                <div className={s.icon}>
                                    {c.icon}
                                </div>
                                <div className={s.label}>
                                    <div className={s.title}>
                                        {c.title}
                                    </div>
                                    <div className={s.subTitle}>
                                        {c.subTitle}
                                    </div>                            
                                </div>
                            </div>
                        </Card>
                    ))}
                    <div className={s.appVersion}>
                        App Version 1.0.0
                    </div>
                </div>

                <Modal
                    title="Edit Profile"
                    isVisible={visible}
                    handleCloseButton={setVisible}
                    handleSubmit={_handleSubmit}
                    textSubmit="Save changes"
                    scrollview={true}

                >
                    {form.map((item, i) => (
                        <Form
                            disabled={false}
                            key={i}
                            label={item.label}
                            name={item.name}
                            type={item.type}
                            value={payload[item.name]}
                            required
                            handleChange={_handleChange}
                            hasError={hasError(errorList, item.name)}
                            errorMessage={                                         
                                item.name === 'email' && invalidEmailFormat 
                                ? 'Kesalahan pada format Email' 
                                : ''
                            }
                        />
                    ))}
                </Modal>
            </div>
        </Layout>
    );
};