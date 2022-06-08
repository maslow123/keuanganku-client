import { Splash } from '@components/common';
import { Form } from '@components/ui';
import Badge from '@components/ui/Badge';
import { status } from '@lib/constants';
import { useAuth } from 'context/auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LoginResponse } from 'services/types/users';
import { loginUser } from 'services/users';
import { hasError, validate } from 'util/helper';
import { images } from 'util/images';
import s from './Login.module.css';
import Cookies from 'js-cookie';
import Router from 'next/router';

export default function Login() {
    const ctx = useAuth();

    const [payload, setPayload] = useState<any>({
        email: '',
        password: ''
    });    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [invalid, setInvalid] = useState<boolean>(false);
    const [invalidEmailFormat, setInvalidEmailFormat] = useState<boolean>(false);

    
    const _handleChange = (evt): void => {
        const value = evt.target.value;
        const name = evt.target.name;

        setPayload({ ...payload, [name]: value });
    };

    const _handleSubmit = async (e): Promise<boolean> => {
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
        const resp: LoginResponse = await loginUser(payload);
        setIsLoading(false);

        let isValid = false;
        if (resp.status !== status.OK) {
            isValid = true;
            error = resp.status === status.NotFound ? 'User atau password yang dimasukkan salah' : resp.error;
        }

        setErrorMessage(error);
        setInvalid(isValid);

        if (isValid || error) { return false; }

        Cookies.set('token', resp.token);
        Cookies.set('user', JSON.stringify(resp.user));
        ctx.setUser(resp.user);

        Router.push('/dashboard');
        return true;   
    }

    const form = [
        {
            label: 'Email',
            name: 'email',
            type: 'text'
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password'
        }
    ];

    return (
        <>  
            {!ctx.splashScreen && <Splash/>}
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
                        <span>aplikasi mudah dan cepat dalam mengatur Keuanganmu</span>
                    </div>
                </div>
                <div className={s.rightpane}>
                    <div className={s.appNameWrapper}>
                        <span className={s.appName}></span>                                    
                    </div>
                    <div className={s.welcomeWrapper}>
                        <span className={s.welcomeText}>Selamat Datang</span>                
                        <div className={s.loginFormWrapper}>   
                            {invalid && (
                                <Badge caption={errorMessage} color="error"/>
                            )}                              
                            <form className={s.form} onSubmit={_handleSubmit}>                        
                                {form.map((item, i) => (
                                    <Form
                                        disabled={false}
                                        key={i}
                                        label={item.label}
                                        name={item.name}
                                        type={item.type}
                                        required
                                        handleChange={_handleChange}
                                        hasError={hasError(errorList, item.name)}
                                        errorMessage={item.name === 'email' && invalidEmailFormat ? 'Kesalahan pada format Email' : '' }
                                    />
                                ))}
                                <div className="text-right pb-4">
                                    Lupa Password?
                                </div>

                                <button className="bg-red rounded-full py-2 px-5 h-10 mb-3" disabled={isLoading} type="submit">
                                    <span className="uppercase text-black tracking-widest">
                                        Login
                                    </span>
                                </button><br/>
                            </form>

                            <span className={s.registerText}>
                                Belum punya akun? 
                                <Link href={"/register"}>
                                    <a href="#"> Daftar di sini</a>
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};