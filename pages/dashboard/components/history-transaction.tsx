import s from './../Dashboard.module.css';
import { CloudDownloadIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { mock } from '@util/mock';
import { transaction_type } from '@lib/constants';
import { formatMoney } from '@util/helper';

const HistoryTransaction = () => {        
    return (
        <>
            <div className="font-bold pb-3">
                <span>Transaction</span>
            </div>
            <div className={s.transactionList}>
                {mock.transaction.list.map((item, i) => (
                    <div className={s.row} key={i}>                
                        <div className={s.transaction}>
                            <div className={s.transactionAmount}>
                                {formatMoney(item.amount)}
                            </div>
                            <div className={s.sendBy}>
                                Send by
                                <span className={item.type ? 'text-sky-400' : 'text-emerald-500'}> {transaction_type[item.type]}</span>
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