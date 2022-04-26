import { FC, ReactNode } from "react";
import s from './Card.module.css';

interface Props {
    children: ReactNode;
    color: string;
};

const Card:FC<Props> = ({ children, color }) => {
    return (
        <div className={`${s.card}`} style={{ background: color }}>
            {children}
        </div>
    );
};

export default Card