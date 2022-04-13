import { Form } from '@components/ui';
import Badge from '@components/ui/Badge';
import { status } from '@lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { RegisterRequest, RegisterResponse } from 'services/types/users';
import { registerUser } from 'services/users';
import { hasError, validate } from 'util/helper';
import { images } from 'util/images';
import s from './Register.module.css';

export default function Login() {
    const [payload, setPayload] = useState<RegisterRequest>({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
    });    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [invalid, setInvalid] = useState<boolean>(false);
    const [invalidEmailFormat, setInvalidEmailFormat] = useState<boolean>(false);
    const [passwordNotMatch, setPasswordNotMatch] = useState<boolean>(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

    const _handleChange = (evt): void => {
        const value = evt.target.value;
        const name = evt.target.name;

        setPayload({ ...payload, [name]: value });
    };

    const _handleSubmit = async (e): Promise<boolean> => {
        e.preventDefault();
        setInvalidEmailFormat(false);
        setPasswordNotMatch(false);

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
        const resp: RegisterResponse = await registerUser(payload);
        setIsLoading(false);

        let isValid = false;
        let registerSuccess = true;
        if (resp.status !== status.Created) {
            isValid = true;
            error = resp.error;
            registerSuccess = false;
        }

        const p = await resetPayload(payload);
        setRegisterSuccess(registerSuccess);
        setErrorMessage(error);
        setInvalid(isValid);
        setPayload({ ...p });
        

        if (error) { return false };
        return true;   
    };
    
    const resetPayload = (payload: RegisterRequest): RegisterRequest => {
        for (let p of Object.keys(payload)) {
            payload[p] = '';
        }

        return payload;
    }
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
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password'
        },
        {
            label: 'Konfirmasi Password',
            name: 'confirm_password',
            type: 'password'
        }
    ];

    return (
        <>
            <div className={s.parent}>                
                <div className={s.leftpane}>
                    <div className={s.image}>  
                        <Image
                            className={s.placeholderImage}
                            alt="login"
                            src={images.login}
                            layout="intrinsic"
                            quality={100}
                            width={500}
                            height={500}
                        />
                    </div>
                    <div className={s.caption}>
                        <span className={s.variant}>Keuanganmu</span><br/><br/>
                        <span className={s.quote}>Ayo daftar, lalu nikmati fitur di dalamnya</span>
                    </div>
                </div>
                <div className={s.rightpane}>
                    <div className={s.appNameWrapper}>
                        <span className={s.appName}></span>                                    
                    </div>
                    <div className={s.welcomeWrapper}>
                        <span className={s.welcomeText}>Daftar</span>                
                        <div className={s.loginFormWrapper}>      
                            {invalid && (
                                <Badge caption={errorMessage} color="error"/>
                            )}            
                            {registerSuccess && (
                                <Badge caption={'Selamat, kamu berhasil mendaftar. Silakan lakukan login.'} color="success"/>
                            )}               
                            <form className={s.form} onSubmit={_handleSubmit}>                        
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
                                            : item.name === 'confirm_password' && passwordNotMatch
                                                ? 'Password tidak sesuai, harap periksa kembali'
                                                : '' 
                                        }
                                    />
                                ))}
                                <button className="bg-red rounded-full py-2 px-5 h-10 mb-3" disabled={isLoading}>
                                    <span className="uppercase text-black tracking-widest">
                                        Daftar
                                    </span>
                                </button><br/>
                            </form>      
                            <span className={s.loginText}>
                                Sudah punya akun? 
                                <Link href={"/login"}>
                                    <a href="#"> Login di sini</a>
                                </Link>
                            </span>                      
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};