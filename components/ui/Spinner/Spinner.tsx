import React, { FC } from 'react';
import s from './Spinner.module.css';

interface Props {}

const Spinner: FC<Props> = () => {    
    return (
        <div className={s.spinner}></div>
    );
};

export default Spinner;