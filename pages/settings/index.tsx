import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Header, Layout } from "@components/common";
import { PencilIcon, KeyIcon, IdentificationIcon, LogoutIcon } from "@heroicons/react/outline";
import { images } from "@util/images";
import { Card, Form, Spinner } from "@components/ui";
import { useAuth } from "context/auth";
import { useRouter } from "next/router";
import { hasError, logout, showToast, validate } from "@util/helper";
import { Modal } from "@components/ui";
import { status } from '@lib/constants';
import { ChangePasswordRequest, UpdateRequest } from 'services/types/users';
import { changePassword, updateUser, uploadImage } from 'services/users';
import { Loading } from './types';
import Image from "next/image";
import s from "./Settings.module.css";
import Cookies from 'js-cookie';


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
    
    const [isLoading, setIsLoading] = useState<Loading>({
        changeProfile: false,
        changePassword: false,
        changeImage: false
    });
    
    const [visible, setVisible] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [invalidEmailFormat, setInvalidEmailFormat] = useState<boolean>(false);
    const [passwordNotMatch, setPasswordNotMatch] = useState<boolean>(false);
    const [formType, setFormType] = useState<string>('profile');
    const fileInput = useRef<any>(null);

    const setLoading = (type: string, state: boolean) => {
        setIsLoading({
            ...isLoading,
            [type]: state
        });
    };

    const _handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload: any = formType === 'profile' ? updateProfilePayload : changePasswordPayload;
        const key = formType === 'profile' ? 'changeProfile' : 'changePassword';

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
        
        setLoading(key, true);
        const resp: any = await func(payload);
        setLoading(key, false);

        if (resp.status !== status.OK) {            
            error = resp.error;
            showToast('error', resp.error);
        }
        if (error) { return false };

        showToast('success', 'Data sucessfully edited');
        setVisible(!visible);

        if (formType === 'profile') {
            const user = {
                ...ctx.user,
                ...updateProfilePayload
            };
            ctx.setUser({ ...user });
            Cookies.set('user', JSON.stringify(user));
            return true;
        }

        resetChangePasswordPayload();
        return true;   
    };
    const _handleChange = (evt: ChangeEvent<HTMLInputElement>): void => {
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
    
    const _handleClickUpload = () => {
        fileInput.current.click();
    };

    const _handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        setLoading('changeImage', true);

        const formData = new FormData();
        formData.append(e.target.name, e.target.files[0]);

        const resp = await uploadImage(formData);
        if(resp?.id) {
            const user = {
                ...ctx.user,
                photo: `${resp.id}${resp.type}`
            };
            ctx.setUser({ ...user });
            Cookies.set('user', JSON.stringify(user));
            setLoading('changeImage', false);
        }
    }
    
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

    const _renderTextSubmit = () => {
        if ((formType === 'profile' && isLoading.changeProfile) || (formType !== 'profile' && isLoading.changePassword)) {
            return 'Loading' 
        }
        return 'Save Changes';
    };

    const _renderDisableButton = () => {
        return (formType === 'profile' && isLoading.changeProfile) || (formType !== 'profile' && isLoading.changePassword);
    };

    return (
        <Layout>            
            <Header title="Settings"/>
            <div className={s.container}>
                <div className={s.user}>
                    <div className={s.row}>
                        <div className={s.profile}>
                        <div className={`${s.avatar} ${isLoading.changeImage && 'opacity-30'}`}>
                            <Image
                                alt="avatar"
                                src={ctx?.user?.photo ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${ctx?.user?.photo}` : images.avatar}
                                layout="intrinsic"
                                quality={100}
                                width={100}
                                height={100}
                                className={`${s.image} ${isLoading.changeImage && 'opacity-30'}`}
                            />
                            <div className={`${s.middle} ${isLoading.changeImage && 'opacity-100'}`}>
                                <div className={s.text} onClick={_handleClickUpload}>
                                    <input 
                                        disabled={isLoading.changeImage}
                                        name="file"
                                        type="file" 
                                        hidden 
                                        ref={fileInput} 
                                        accept="image/png, image/gif, image/jpeg"
                                        onChange={_handleUploadImage}
                                    />
                                    {isLoading.changeImage 
                                        ? <Spinner />
                                        : <PencilIcon className="w-5 h-5"/>
                                    }
                                </div>
                            </div>
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
                        App version {process.env.NEXT_PUBLIC_APP_VERSION}
                    </div>
                </div>

                <Modal
                    title={formType === 'profile' ? 'Edit Profile' : 'Change Password'}
                    isVisible={visible}
                    handleCloseButton={_handleCloseModal}
                    handleSubmit={_handleSubmit}
                    textSubmit={_renderTextSubmit()}
                    scrollview={true}
                    disabled={_renderDisableButton()}

                >
                    {renderForm()}
                </Modal>
            </div>
        </Layout>
    );
};