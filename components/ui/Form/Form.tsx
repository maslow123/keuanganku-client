import { ChangeEventHandler, FC } from "react";
import s from './Form.module.css';
import Select from "./Select";
import { Calendar } from 'react-date-range';

interface Props {
    label: string;
    required: Boolean;
    name: string;
    type: string;
    hasError: Boolean;
    disabled: boolean;
    handleChange:  ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    errorMessage?: string;
    value?: string | number | readonly string[];
    isChecked?: boolean;
    list?: Record<string, any>
    colors?: string[];
};

const Form:FC<Props> = ({ label, required, name, type, hasError, disabled, handleChange, errorMessage, value, isChecked, list, colors }) => {

    const generateForm = () => {
        switch(type) {
            case 'text':
            case 'number':
            case 'password':
                return (
                    <input 
                        disabled={disabled}
                        className={`${s.formInput}`} 
                        style={{ borderColor: hasError && 'red' }}
                        name={name} 
                        type={type === 'number' ? 'text' : type}
                        placeholder={label}
                        onChange={e => {
                            if (disabled) {
                                return false;
                            }
                            if (type === 'number') {
                               e.target.value = e.target.value.replace(/[^\d]+/g,'');                               
                            }

                            handleChange(e);
                        }}
                        value={value}
                    />
                );
            case 'textarea':
                return (
                    <textarea                
                        disabled={disabled}
                        className={`${s.formInput} h-11`} 
                        style={{ borderColor: hasError && 'red' }}
                        name={name}
                        placeholder={label}
                        onChange={disabled ? () => {}: handleChange}
                        value={value}
                    />
                );
            case 'checkbox':
                return (
                    <>
                        <input 
                            type="checkbox" 
                            className={s.checkbox} 
                            onChange={handleChange} 
                            name={name}
                            checked={isChecked}
                        />
                        <span className={s.checkmark}></span>
                    </>
                ); 
            case 'select':
                return (
                    <Select
                        value={value}
                        handleChange={e => {
                            e.field = name;
                            handleChange(e);
                        }}
                        list={list}
                    />
                );           
            case 'color':
                return (
                    <div className="flex overflow-auto">
                        {
                            colors.map(color => (
                                <div key={color}>
                                    <button 
                                        name={name}
                                        type="button"
                                        className="rounded-full w-8 h-8 mr-3 border-2" 
                                        style={{ 
                                            background: color, 
                                            borderColor: value === color ? 'grey' : 'white'
                                        }}
                                        onClick={(e: any) => {
                                            e.target.value = color;                                        
                                            handleChange(e);
                                        }}
                                    />
                                </div>
                            ))
                        }
                    </div>
                );
            case 'radio':
                return (
                    <>
                    
                        <div>
                            {list.map((item, i) => (
                                <div key={i} className="flex items-center mr-4 mb-4">
                                    <input 
                                        id={`${item.name}-${i}`} 
                                        type="radio" 
                                        name={name} 
                                        className="hidden" 
                                        value={item.id}
                                        onClick={(e: any) => handleChange(e)}
                                    />
                                    <label htmlFor={`${item.name}-${i}`} className={`flex items-center cursor-pointer text-sm`}>
                                        <span className="w-4 h-4 inline-block mr-2 rounded-full border border-gray-400 flex-no-shrink"></span>
                                        {item.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'date': {
                return (
                    <>
                        <Calendar                                                        
                            date={new Date(parseInt(value as string))}                        
                            onChange={date => {
                                const e: any = {};
                                e.target = {};
                                e.target.name = 'date';
                                e.target.value = date.getTime();

                                handleChange(e);
                            }}
                            maxDate={new Date()}
                        />
                    </>
                )
            }
            default:
                return null
        }
    };

    return (
        <div className={`mb-6`}>
            <label className={s.label}>
                {required && (<span className="text-red">* </span>)}
                {label}
                
            </label>
            {generateForm()}
            {hasError 
            && (
                <div className="text-left" style={{ color: 'red' }}>
                    <span className="capitalize">{ !errorMessage && label} </span> 
                    {errorMessage || `is required`} 
                </div>
            )}            
        </div>            
    );
};

export default Form