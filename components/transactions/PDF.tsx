import { FC } from "react";
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ListTransactionResponse } from "services/types/transactions";
import { transaction_type } from "@lib/constants";
import { formatDate, formatMoney, getTotalTransaction } from "@util/helper";

interface Props {
    data: ListTransactionResponse;
    title: string;
    action: number;
};

const PDF:FC<Props> = ({ data, title, action }) => {
    const fields = ['No', 'Pos Name', 'Details', 'Method', 'Time', 'Total'];
    const total = getTotalTransaction(data);
    const styles = StyleSheet.create({
        table: {
            width: '100%',
        },
        headerTitle: {         
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 20   
        },
        title: {
            fontSize: 18,
            paddingBottom: 5,
            fontWeight: 'bold'
        },
  		subTitle: {
            fontSize: 12,
            paddingBottom: 3,
            fontWeight: 'thin'
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px solid #EEE',
            paddingTop: 8,
            paddingBottom: 8,
        },
        header: {
            borderTop: 'none',
        },
        bold: {
            fontWeight: 'bold',
        },
        row1: {
            width: `${100 / fields.length}%`,
            paddingLeft: 10,
            fontSize: 10,
            textAlign: 'center'
        },
          lastRow: {
            width: `${100 / fields.length}%`,
            paddingLeft: 10,
            fontSize: 10,
            textAlign: 'center',
          
        }
    });

    return (
        <Document>
            <Page size="A4" orientation="landscape">
                <View style={styles.headerTitle}>
                    <Text style={styles.title}>{action ? 'Outcome' : 'Income'}</Text>
                    <Text style={styles.subTitle}>{title}</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.row, styles.bold, styles.header]}>
                    {
                        fields.map((field, key) => (                            
                            <Text key={key} style={styles.row1}>{field}</Text>
                        ))
                    }  
                    </View>
                    {data?.transaction?.length > 0 && data.transaction.map((tx, key) => (
                        <View key={key} style={styles.row} wrap={false}>
                            <Text style={styles.row1}>{key + 1}</Text>
                            <Text style={styles.row1}>{tx.pos.name}</Text>
                            <Text style={styles.row1}>{tx.details}</Text>
                            <Text style={styles.row1}>{transaction_type[tx.type]}</Text>
                            <Text style={styles.row1}>{formatDate(tx.created_at)}</Text>
                            <Text style={styles.row1}>{formatMoney(tx.total)}</Text>
                        </View>
                    ))}
                    <View style={styles.row} wrap={false}>
                            <Text style={styles.row1}></Text>
                            <Text style={styles.row1}></Text>
                            <Text style={styles.row1}></Text>
                            <Text style={styles.row1}></Text>
                            <Text style={styles.row1}></Text>
                            <Text style={styles.row1}>{formatMoney(total)}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};


export default PDF;