import React, { FC, FormEventHandler, ReactNode, useState } from 'react';
import Form from '../Form';
import s from './Modal.module.css';

interface Props {
    isVisible: boolean;
    onClick: Function;
    title: string;
    children: ReactNode;
    _handleSubmit: FormEventHandler<any> | undefined;
}

const Modal: FC<Props> = ({ isVisible, onClick, title, children, _handleSubmit }) => {    
    return (
        <>        
            {isVisible ? (
                <form onSubmit={_handleSubmit}>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-1/2 my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex self-center justify-center p-5  rounded-t">
                                <h3 className="text-2xl font-semibold uppercase">
                                    {title}
                                </h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => onClick(!isVisible)}
                                >
                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        ×
                                    </span>
                                </button>
                            </div>
                            {/*body*/}
                            <div className="relative p-6 flex-auto">
                                {children}
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => onClick(!isVisible)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-blue-theme text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="submit"
                            >
                                Save Changes
                            </button>
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