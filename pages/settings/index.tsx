import { Header, Layout } from "@components/common";
import s from "./Settings.module.css";
import { PencilIcon, KeyIcon, IdentificationIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { images } from "@util/images";
import { Card } from "@components/ui";
import { useAuth } from "context/auth";

export default function Settings() { 
    const ctx = useAuth();
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
        }
    ];
    return (
        <Layout>            
            <Header title="Settings"/>
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
                    <div className={`${s.row} items-center`}>
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
            </div>
            <div className={s.appVersion}>
                App Version 1.0.0
            </div>
        </Layout>
    );
};