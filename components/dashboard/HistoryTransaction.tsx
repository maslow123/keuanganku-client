import s from './Dashboard.module.css';
import { EyeIcon, RefreshIcon, TrashIcon } from '@heroicons/react/outline';
import { ellipsisText, formatDate, formatMoney } from '@util/helper';
import { transaction_type } from '@lib/constants';
import { Loader, Modal } from '@components/ui';
import DetailTransaction from './DetailTransaction';

const HistoryTransaction = ({ data, isNotFound, handleLoadMoreData, onDelete, showDetail, onShowDetail, transactionDetail }) => {   
    const showLoadMoreButton = (i: number, totalData: number) => {
        return (!isNotFound && data?.length >= 10 && (i === totalData));
    };

    return (
        <>            
            <div className={s.transactionList}>                
                {
                    isNotFound && !data
                    ? 'Data not found...'
                    : data?.length > 0 
                        ? 
                            data.map((item, i) => (
                                <div key={i}>
                                    <div className={s.row}>                
                                        <div className={s.transaction}>
                                            <div className={s.transactionAmount}>
                                                {formatMoney(item.total)}
                                            </div>
                                            <div className={s.posName}>                                    
                                                <span style={{ color: item.pos.color }}> {item.pos.name}</span> -
                                                <span> {ellipsisText(item.details)}</span>
                                            </div>
                                            <div className={s.sendBy}>                                    
                                                <span className={item.type ? 'text-sky-500' : 'text-emerald-500'}> {transaction_type[item.type]}</span>
                                            </div>
                                            <div className={s.timestamp}>
                                                {formatDate(item.created_at)}
                                            </div>
                                        </div>
                                        <div className={s.menu}>
                                            <div 
                                                className={`${s.download} cursor-pointer`} 
                                                onClick={() => onDelete(item.id)}
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </div>
                                            <div 
                                                className={`${s.download} cursor-pointer`} 
                                                onClick={() => onShowDetail(!showDetail, item.id)}
                                            >
                                                <EyeIcon className="w-5 h-5"/>
                                            </div>
                                        </div>
                                    </div>                
                                    <div className='w-full border-b-2'></div>
                                    {showLoadMoreButton(i, data.length - 1) && (
                                        <div className={s.loadButtonWrapper}>
                                            <button className={s.loadButton} onClick={handleLoadMoreData}>
                                                <RefreshIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    )}
                                    <Modal 
                                        isVisible={showDetail} 
                                        handleCloseButton={(isVisible) => onShowDetail(isVisible)}
                                        title="Detail transaction"
                                        autoWidth={true}                                                                
                                    >
                                        <DetailTransaction data={transactionDetail}/>
                                    </Modal>
                                </div>
                            ))                
                        : <Loader count={3} height={50} className={"my-3"}/>
                }
            </div>
        </>
    );
};

export default HistoryTransaction;