import React, { FC, ReactChild } from 'react';
import s from './Tooltip.module.css';

interface Props {
    text: string;
    children: ReactChild
};

const Tooltip: FC<Props> = ({ text, children }) => {    
    return (
        <div className={s.tooltip}> 
            {children}               
            {text && (
                <div className={s.tooltipText}>
                    {text}
                </div>
            )}               
        </div>
    );
};

export default Tooltip;