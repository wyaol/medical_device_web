import {Table, TableProps} from 'antd';

interface CO2RealData {
    ETCO2: any;
    RR: any;
    FiCO2: any;
    co2Waveform: any;
    interval: any;
    status: any;
    I_per_E: any
}

const columns: TableProps<Record<string, string>>['columns'] = [
    {
        title: (<div>CO2<br/>(mmhg)</div>),
        dataIndex: 'co2_waveform',
        key: 'co2_waveform',
        align: 'center',
        width: '400px',
    },
    {
        title: (<div>呼末 CO2 浓度值<br/>(ETCO2)</div>),
        dataIndex: 'ETCO2',
        key: 'ETCO2',
        align: 'center',
        width: '400px',
    },
    {
        title: (<div>呼吸率<br/>(RR)</div>),
        dataIndex: 'RR',
        key: 'RR',
        align: 'center',
        width: '400px',
    },
    {
        title: (<div>吸入 CO2 浓度值<br/>(FiCO2)</div>),
        dataIndex: 'FiCO2',
        key: 'FiCO2',
        align: 'center',
        width: '400px',
    },
    {
        title: 'I:E',
        dataIndex: 'I_per_E',
        key: 'I_per_E',
        align: 'center',
        width: '400px',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: '400px',
    },
    {
        title: '间隔',
        dataIndex: 'interval',
        key: 'interval',
        align: 'center',
        width: '400px',
    },
];

const renderData = (data: CO2RealData | null): {}[] => {
    return data ? [
        {
            key: '1',
            co2_waveform: data.co2Waveform.toFixed(2),
            status: data.status || '',
            I_per_E: data.I_per_E?.toFixed(2) || '',
            interval: data.interval.toFixed(2),
            ETCO2: data.ETCO2?.toFixed(2) || '',
            RR: data.RR?.toFixed(2) || '',
            FiCO2: data.FiCO2?.toFixed(2) || '',
        },
    ] : [
        {
            key: '1',
            co2_waveform: 0,
            status: '',
            I_per_E: 0,
            interval: 0,
            ETCO2: 0,
            RR: 0,
            FiCO2: 0,
        },
    ];
};

const CO2RealDataTable: React.FC<{ data: CO2RealData }> = ({data}) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto',
            }}
        >
            <Table
                columns={columns}
                dataSource={renderData(data)}
                pagination={false}
                bordered
                title={() => <h2 style={{textAlign: 'center', height: '6px'}}>CO2实时指标数据</h2>}
            />
        </div>
    );
};

export default CO2RealDataTable;
