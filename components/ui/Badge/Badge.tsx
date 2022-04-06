import React, { FC } from 'react';
import s from './Badge.module.css';

interface Props {
    caption?: string;
    color: string;
};

const Badge: FC<Props> = ({ caption, color }) => {
    const badgeColor = color === 'error' ? 'bg-red' : 'bg-green';
    return (    
        <>                            
            <br/>
            <span className={`${s.error} ${badgeColor}`}>
                {caption}
            </span>              
        </>
    )
};

export default Badge;