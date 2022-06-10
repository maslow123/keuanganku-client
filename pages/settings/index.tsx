import React, { FC, useState } from 'react';
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
import { ChangePasswordRequest, UpdateRequest } from 'services/types/users';
import { changePassword } from 'services/users';


export default function Settings() { 
    const ctx = useAuth();
    const router = useRouter();
    const cards = [
        {
            icon: <KeyIcon className="w-6 h-6"/>,
            title: 'Password',
            subTitle: 'Change password settings',
            onClick: () => _handleChangePassword()
        },
        {
            icon: <IdentificationIcon className="w-6 h-6"/>,
            title: 'Privacy',
            subTitle: 'Change privacy settings',
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

    const updateProfileForm = [
        {
            label: 'Nama',
            name: 'name',
            type: 'text',
            
        },
        {
            label: 'Email',
            name: 'email',
            type: 'text',
            
        }
    ];

    const changePasswordForm = [
        {
            label: 'Current Password',
            name: 'old_password',
            type: 'password',        
        },                
        {
            label: 'Password',
            name: 'password',
            type: 'password',            
        },                
        {
            label: 'Confirm Password',
            name: 'confirm_password',
            type: 'password'            
        }       
    ]

    const [updateProfilePayload, setUpdateProfilePayload] = useState<UpdateRequest>({
        name: ctx?.user?.name,
        email: ctx?.user?.email
    });

    const [changePasswordPayload, setChangePasswordPayload] = useState<ChangePasswordRequest>({
        old_password: '',
        password: '',
        confirm_password: ''
    });
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [invalidEmailFormat, setInvalidEmailFormat] = useState<boolean>(false);
    const [passwordNotMatch, setPasswordNotMatch] = useState<boolean>(false);
    const [formType, setFormType] = useState<string>('profile');


    const _handleSubmit = async (e) => {
        e.preventDefault();
        const payload: any = formType === 'profile' ? updateProfilePayload : changePasswordPayload;
        const func = formType === 'profile' ? updateUser : changePassword;
        setPasswordNotMatch(false);

        setInvalidEmailFormat(false);

        let error = '';
        const errors = validate(payload);
        const invalidEmail = errors.find(err => err === 'invalid-format-email');
        if (invalidEmail) {
            setInvalidEmailFormat(true);
        }        
        const passwordNotMatch = errors.find(err => err === 'password-not-match');
        if (passwordNotMatch) {
            setPasswordNotMatch(true);
        }
        
        setErrorList(errors);
        if (errors.length > 0) { return false };
        
        setIsLoading(true);
        const resp: any = await func(payload);
        setIsLoading(false);

        let isValid = false;
        if (resp.status !== status.OK) {
            isValid = true;
            error = resp.error;
            showToast('error', resp.error);
        }
        if (error) { return false };

        showToast('success', 'Data sucessfully edited');
        setVisible(!visible);

        ctx.setUser({
            ...ctx.user,
            ...updateProfilePayload
        });

        return true;   
    };
    const _handleChange = (evt): void => {
        const setPayload = formType === 'profile' ? setUpdateProfilePayload : setChangePasswordPayload;
        const payload: any = formType === 'profile' ? updateProfilePayload : changePasswordPayload;

        const value = evt.target.value;
        const name = evt.target.name;

        setPayload({ ...payload, [name]: value });
    };

    const _handleEditProfile = () => {        
        setVisible(!visible);
        setFormType('profile');
    };

    const _handleChangePassword = () => {
        setVisible(!visible);
        setFormType('change-password');
    };

    const _handleCloseModal = (isVisible) => {
        setVisible(isVisible);
        if (formType === 'change-password') { resetChangePasswordPayload() };
    };
    
    const renderForm = () => {
        const form = formType === 'profile' ? updateProfileForm : changePasswordForm;
        const payload = formType === 'profile' ? updateProfilePayload : changePasswordPayload;


        return form.map((f, key) => (
            <Form
                disabled={false}
                key={key}
                label={f.label}
                name={f.name}
                type={f.type}
                value={payload[f.name]}
                required
                handleChange={_handleChange}
                hasError={hasError(errorList, f.name)}
                errorMessage={                                         
                    f.name === 'email' && invalidEmailFormat 
                    ? 'Kesalahan pada format Email' 
                    : f.name === 'confirm_password' && passwordNotMatch
                        ? 'Password tidak sesuai, harap periksa kembali'
                        : ''
                }
            />
        ));
    };

    const resetChangePasswordPayload = () => {
        for (const prop of Object.getOwnPropertyNames(changePasswordPayload)) {
            changePasswordPayload[prop] = '';
        };


        setChangePasswordPayload({ ...changePasswordPayload });
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
                            onClick={_handleEditProfile}
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
                    handleCloseButton={_handleCloseModal}
                    handleSubmit={_handleSubmit}
                    textSubmit="Save changes"
                    scrollview={true}

                >
                    {renderForm()}
                </Modal>
            </div>
        </Layout>
    );
};