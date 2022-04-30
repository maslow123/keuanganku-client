import s from './../Dashboard.module.css';
import { CloudDownloadIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { formatMoney } from '@util/helper';

const HistoryTransaction = ({ data }) => {        
    return (
        <>            
            <div className={s.transactionList}>
                {data?.length > 0 && data.map((item, i) => (
                    <div className={s.row} key={i}>                
                        <div className={s.transaction}>
                            <div className={s.transactionAmount}>
                                {formatMoney(item.total)}
                            </div>
                            <div className={s.sendBy}>
                                Send by
                                <span style={{ color: item.pos.color }}> {item.pos.name}</span>
                            </div>
                        </div>
                        <div className={s.menu}>
                            <div className={s.download}>
                                <CloudDownloadIcon className="w-5 h-5"/>
                            </div>
                            <div className={s.detail}>
                                <DocumentTextIcon className="w-5 h-5"/>
                            </div>
                        </div>
                    </div>                
                ))}
            </div>
        </>
    );
};

export default HistoryTransaction;