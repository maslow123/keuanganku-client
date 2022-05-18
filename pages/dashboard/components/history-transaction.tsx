import s from './../Dashboard.module.css';
import { CloudDownloadIcon, DocumentTextIcon, RefreshIcon, TrashIcon } from '@heroicons/react/outline';
import { formatDate, formatMoney } from '@util/helper';
import { transaction_type } from '@lib/constants';

const HistoryTransaction = ({ data, isNotFound, handleLoadMoreData, onDelete }) => {   
    const showLoadMoreButton = (i: number, totalData: number) => {
        return (!isNotFound && data?.length >= 10 && (i === totalData));
    };

    return (
        <>            
            <div className={s.transactionList}>                
                {
                    isNotFound && !data
                    ? 'Data not found...'
                    : data?.length > 0 && data.map((item, i) => (
                        <div key={i}>
                            <div className={s.row}>                
                                <div className={s.transaction}>
                                    <div className={s.transactionAmount}>
                                        {formatMoney(item.total)}
                                    </div>
                                    <div className={s.posName}>                                    
                                        <span style={{ color: item.pos.color }}> {item.pos.name}</span> -
                                        <span> {item.details}</span>
                                    </div>
                                    <div className={s.sendBy}>                                    
                                        <span className={item.type ? 'text-sky-500' : 'text-emerald-500'}> {transaction_type[item.type]}</span>
                                    </div>
                                    <div className={s.timestamp}>
                                        {formatDate(item.created_at)}
                                    </div>
                                </div>
                                <div className={s.menu}>
                                    <div className={`${s.download} cursor-pointer`} onClick={() => onDelete(item.id)}>
                                        <TrashIcon className="w-5 h-5"/>
                                    </div>
                                    <div className={s.download}>
                                        <CloudDownloadIcon className="w-5 h-5"/>
                                    </div>
                                    <div className={s.detail}>
                                        <DocumentTextIcon className="w-5 h-5"/>
                                    </div>
                                </div>
                            </div>                
                            
                            {showLoadMoreButton(i, data.length - 1) && (
                                <div className={s.loadButtonWrapper}>
                                    <button className={s.loadButton} onClick={handleLoadMoreData}>
                                        <RefreshIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))                
                }
            </div>
        </>
    );
};

export default HistoryTransaction;