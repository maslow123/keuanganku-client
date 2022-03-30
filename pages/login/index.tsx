import { Splash } from '@components/common';
import { Form } from '@components/ui';
import Image from 'next/image';
import Link from 'next/link';
import React, { Component, useState } from 'react';
import { hasError } from 'util/helper';
import { images } from 'util/images';
import s from './Login.module.css';

export default function Login() {
    const [payload, setPayload] = useState<any>({
        email: '',
        password: ''
    });    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>(null);
    const [invalidEmailFormat, setInvalidEmailFormat] = useState<boolean>(false);

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
            <Splash />
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
                            <form className={s.form} onSubmit={() => {}}>                        
                                {form.map((item, i) => (
                                    <Form
                                        disabled={false}
                                        key={i}
                                        label={item.label}
                                        name={item.name}
                                        type={item.type}
                                        required
                                        handleChange={() => {}}
                                        hasError={hasError(errorList, item.name)}
                                        errorMessage={item.name === 'email' && invalidEmailFormat ? 'Kesalahan pada format Email' : '' }
                                    />
                                ))}
                                <div className="text-right pb-4">
                                    Lupa Password?
                                </div>

                                <button className="bg-red rounded-full py-2 px-5 h-10 mb-3" disabled={isLoading}>
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