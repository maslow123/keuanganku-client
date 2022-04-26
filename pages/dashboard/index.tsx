import React from 'react';
import { Layout } from '@components/common';
import s from './Dashboard.module.css'
import Image from 'next/image';
import { images } from "@util/images";
import { CogIcon, BellIcon } from "@heroicons/react/outline";
import { Tabs } from '@components/ui';
import { FirstTab, HistoryTransaction } from './components';

export default function Dashboard() { 
    return (
        <Layout>
            <>
                <div className={s.headerWrapper}>
                    <div className={s.leftHeader}>
                        <div className={s.avatar}>
                            <Image
                                alt="avatar"
                                src={images.avatar}
                                layout="intrinsic"
                                quality={100}
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                        </div>
                        <div className={s.sectionName}>
                            <div className={s.name}>
                                Omama
                            </div>
                            <div className={s.greeting}>
                                Selamat pagi
                            </div>
                        </div>
                    </div>
                    <div className={s.rightHeader}>
                        <div className={s.settingButton}>
                            <CogIcon className="w-6 h-6"/>
                        </div>
                        <div className={s.notificationButton}>
                            <BellIcon className="w-6 h-6"/>
                        </div>
                    </div>
                </div>
                <div className={s.tab}>
                    <>                    
                        <Tabs 
                            tabs={[<FirstTab key={0}/>]} 
                            titles={['Personal Balance', 'Savings']}
                        />
                        <HistoryTransaction/>
                    </>
                </div>

            </>
        </Layout>
    )
}