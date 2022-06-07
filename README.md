Design Reference: https://dribbble.com/shots/17250392-Quari-Wallet/attachments/12357471?mode=media
Color palettes: https://www.canva.com/colors/color-palettes/to-the-sky/ 

Mock for pdf:
```
const fields = ['No', 'Pos Name', 'Details', 'Method', 'Time', 'Total'];
const data = [
  {
    "pos": "omama",
    "total": 100000,
    "details": "Beli baso",
    "method": "Transfer",
    "time": new Date()
  },
  {
    "pos": "omama",
    "total": 200000,
    "details": "Beli somay",
    "method": "Transfer",
    "time": new Date()
  }
]
const Quixote = () => (
 <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
          <View style={styles.headerTitle}>
              <Text style={styles.title}>Ini judul</Text>
          </View>
          <View style={styles.table}>
          	<View style={[styles.row, styles.bold, styles.header]}>
              {
                  fields.map((field) => (                            
                      <Text style={styles.row1}>{field}</Text>
                  ))
              }  
            </View>
            {data.map((item, key) => (
            	<View style={styles.row} wrap={false}>
                    <Text style={styles.row1}>{key + 1}</Text>
                    <Text style={styles.row1}>{item.pos}</Text>
                    <Text style={styles.row1}>{item.details}</Text>
                    <Text style={styles.row1}>{item.method}</Text>
                    <Text style={styles.row1}>{item.time.toString()}</Text>
                    <Text style={styles.row1}>{item.total}</Text>
                </View>
            ))}
            <View style={styles.row} wrap={false}>
                    <Text style={styles.row1}></Text>
                    <Text style={styles.row1}></Text>
                    <Text style={styles.row1}></Text>
                    <Text style={styles.row1}></Text>
                    <Text style={styles.row1}></Text>
                    <Text style={styles.row1}>100000</Text>
            </View>
          </View>
      </Page>
  </Document>
);

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

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
            fontSize: 13,
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

ReactPDF.render(<Quixote />);
```