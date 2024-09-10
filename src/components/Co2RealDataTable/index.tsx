import {Table, TableProps} from 'antd';

interface CO2RealData {
    ETCO2: any;
    RR: any;
    FiCO2: any;
    co2_waveform: any;
    interval: any;
    dpi_info: { status: any; I_per_E: any };
}

const columns: TableProps<Record<string, string>>['columns'] = [
    {
        title: (<div>CO2<br/>(mmhg)</div>),
        dataIndex: 'co2_waveform',
        key: 'co2_waveform',
        align: 'center',
    },
    {
        title: (<div>呼末 CO2 浓度值<br/>(ETCO2)</div>),
        dataIndex: 'ETCO2',
        key: 'ETCO2',
        align: 'center',
    },
    {
        title: (<div>呼吸率<br/>(RR)</div>),
        dataIndex: 'RR',
        key: 'RR',
        align: 'center',
    },
    {
        title: (<div>吸入 CO2 浓度值<br/>(FiCO2)</div>),
        dataIndex: 'FiCO2',
        key: 'FiCO2',
        align: 'center',
    },
    {
        title: 'I:E',
        dataIndex: 'dpi_info.I_per_E',
        key: 'I_per_E',
        align: 'center',
    },
    {
        title: '状态',
        dataIndex: 'dpi_info.status',
        key: 'status',
        align: 'center',
    },
    {
        title: '间隔',
        dataIndex: 'interval',
        key: 'interval',
        align: 'center',
    },
];

const renderData = (data: CO2RealData): {}[] => {
    return [
        {
            key: '1',
            co2_waveform: data.co2_waveform.toFixed(2),
            status: data.dpi_info.status || '',
            I_per_E: data.dpi_info.I_per_E?.toFixed(2) || '',
            interval: data.interval.toFixed(2),
            ETCO2: data.ETCO2?.toFixed(2) || '',
            RR: data.RR?.toFixed(2) || '',
            FiCO2: data.FiCO2?.toFixed(2) || '',
        },
    ];
};

const Co2RealDataTable: React.FC<{ data: CO2RealData }> = ({data}) => {
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
                title={() => <h2 style={{textAlign: 'center'}}>CO2实时指标数据</h2>}
            />
        </div>
    );
};

export default Co2RealDataTable;
