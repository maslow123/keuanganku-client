import React, { FC, useState } from 'react';
import s from './Datepicker.module.css';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker  } from 'react-date-range';
import Modal from '../Modal';
import { CalendarIcon } from '@heroicons/react/outline';

interface Props {
    _handleSubmit: any;
    visible: boolean;
};

const Datepicker: FC<Props> = ({ _handleSubmit, visible }) => {    
    const [selectionDate, setSelectionDate] = useState<Record<string, any>>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',        
    });

    const _handleSelect = ({ selection }) => {
        setSelectionDate({ ...selection });
    };

    const _handleSubmitButton = (e) => {
        e.preventDefault();
        _handleSubmit(selectionDate, !visible, true);
    };

    return (
        <>
            <div className={s.iconWrapper}>
                <button 
                    type="button"
                    className={s.icon}
                    onClick={() => _handleSubmit(selectionDate, !visible)}
                >
                    <CalendarIcon className='w-5 h-5'/>
                </button>
            </div>
            <Modal 
                isVisible={visible} 
                handleCloseButton={(isVisible) => _handleSubmit(selectionDate, isVisible)}
                title="Select date"
                handleSubmit={_handleSubmitButton}
                textSubmit="Set"    
                autoWidth={true}
            >
                <DateRangePicker
                    ranges={[selectionDate]}
                    onChange={_handleSelect}
                />
            </Modal>
        </>
    )
};

export default Datepicker;