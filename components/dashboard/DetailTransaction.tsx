import { transaction_type } from "@lib/constants";
import { formatDate, formatMoney } from "@util/helper";
import { DetailTransactionResponse } from "services/types/transactions";
import s from './Dashboard.module.css';

interface Props {
    data: DetailTransactionResponse;
};

const DetailTransaction: React.FC<Props> = ({ data }) => {
    const transaction = data?.transaction || null;

    return (
        <>
          {transaction && (
            <>
                <div className={s.row}>                
                    <div className={s.transaction}>
                        <div className="py-1">
                            <div className="flex flex-row">
                                <div className="w-16 font-bold"> Total</div>
                                <div className="w-10">:</div>
                                <div className="w-30">{formatMoney(transaction.total)}</div>
                            </div>
                        </div>                        
                        <div className="py-1">
                            <div className="flex flex-row">
                                <div className="w-16 font-bold">Pos</div>
                                <div className="w-10">:</div>
                                <div className="w-30" style={{ color: transaction.pos.color}}>{transaction.pos.name}</div>
                            </div>
                        </div>                       
                        <div className="py-1">
                            <div className="flex flex-row">
                                <div className="w-16 font-bold">Details</div>
                                <div className="w-10">:</div>
                                <div className="w-96 xss:w-56">
                                    {transaction.details}
                                </div>
                            </div>
                        </div>                    
                        <div className="py-1">
                            <div className="flex flex-row">
                                <div className="w-16 font-bold">Type</div>
                                <div className="w-10">:</div>
                                <div className={`w-30 ${transaction.type ? 'text-sky-500' : 'text-emerald-500'}`}>
                                    {transaction_type[transaction.type]}
                                </div>
                            </div>
                        </div>
                        <div className="py-1">
                            <div className="flex flex-row">
                                <div className="w-16 font-bold">Time</div>
                                <div className="w-10">:</div>
                                <div className="w-30">
                                    {formatDate(transaction.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>                
            </>
          )}  
        </>
    )
};

export default DetailTransaction