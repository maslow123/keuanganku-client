import React, { FC, FormEventHandler, ReactNode } from 'react';
import s from './Modal.module.css';

interface Props {
    isVisible: boolean;
    handleCloseButton: Function;
    title: string;
    children: ReactNode;
    handleSubmit?: FormEventHandler<any> | undefined;
    textSubmit?: string;
    autoWidth?: boolean;
    scrollview?: boolean;
}

const Modal: FC<Props> = ({ isVisible, handleCloseButton, title, children, handleSubmit, textSubmit, autoWidth, scrollview }) => {    
    return (
        <>        
            {isVisible ? (
                <form onSubmit={e => handleSubmit(e)}>
                    <div
                        className={s.modal}
                    >
                        <div className={`relative ${!autoWidth && 'w-1/2'} my-6 mx-auto max-w-3xl xs:w-full`}>
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex self-center justify-center p-5  rounded-t">
                                <h3 className="text-2xl font-semibold uppercase">
                                    {title}
                                </h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => handleCloseButton(!isVisible)}
                                >
                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        ×
                                    </span>
                                </button>
                            </div>
                            {/*body*/}
                            <div className={`relative p-6 flex-auto ${scrollview && 'h-96 overflow-auto'}`}>
                                {children}
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => handleCloseButton(!isVisible)}
                            >
                                Close
                            </button>
                            {textSubmit && (
                                <button
                                    className="bg-blue-theme text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="submit"
                                >
                                    {textSubmit}
                                </button>
                            )}
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </form>
            ) : null}
        </>
    )
};

export default Modal;