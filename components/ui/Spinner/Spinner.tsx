import React, { FC } from 'react';
import s from './Spinner.module.css';

interface Props {
    isVisible: boolean;
}

const Spinner: FC<Props> = ({ isVisible }) => {    
    return (
        <div className={s.spinner}></div>
    );
};

export default Spinner;