import { Table, TableProps } from 'antd';

interface HeartRateVariabilityFrequencyDomainMetricsData {
  totalPower: any,
  frequencyPowers: any,
  peakFrequency: any,
  peakAmplitude: any,
  fNormalizedPowers: any,
  balanceIndex: any,
}

const columns: TableProps<Record<string, string>>['columns'] = [
  {
    title: '总功率(TP)',
    dataIndex: 'tp',
    key: 'tp',
  },
  {
    title: '超低频功率(VLF)',
    dataIndex: 'vlf',
    key: 'vlf',
  },
  {
    title: '低频功率(LF)',
    dataIndex: 'lf',
    key: 'lf',
  },
  {
    title: '中频功率(MF)',
    dataIndex: 'mf',
    key: 'mf',
  },
  {
    title: '高频功率(HF)',
    dataIndex: 'hf',
    key: 'hf',
  },
  {
    title: '超高频功率(VHF)',
    dataIndex: 'vhf',
    key: 'vhf',
  },
  {
    title: '峰值频率(TOP_F)',
    dataIndex: 'topF',
    key: 'topF',
  },
  {
    title: '峰值幅度(TOP_H)',
    dataIndex: 'topH',
    key: 'topH',
  },
  {
    title: '总功率%(TP%)',
    dataIndex: 'tp_',
    key: 'tp_',
  },
  {
    title: '超低频功率%(VLF%)',
    dataIndex: 'vlf_',
    key: 'vlf_',
  },
  {
    title: '低频功率%<(LF%)',
    dataIndex: 'lf_',
    key: 'lf_',
  },
  {
    title: '中频功率%<(MF%)',
    dataIndex: 'mf_',
    key: 'mf_',
  },
  {
    title: '高频功率%(HF%)',
    dataIndex: 'hf_',
    key: 'hf_',
  },
  {
    title: '超高频功率%(VHF%)',
    dataIndex: 'vhf_',
    key: 'vhf_',
  },
  {
    title: '平衡指数(L/H)',
    dataIndex: 'l_h',
    key: 'l_h',
  },
];
const renderData = (tp: number, vlf: number, lf: number, mf: number, hf: number, vhf: number,
  topF: number, topH: number, tp_: number, vlf_: number, lf_: number, mf_: number,
  hf_: number, vhf_: number, l_h: number): {}[] => {
  return [
    {
      key: '1',
      tp: tp, vlf: vlf, lf: lf, mf: mf, hf: hf, vhf: vhf, topF: topF, topH: topH,
      tp_: tp_, vlf_: vlf_, lf_: lf_, mf_: mf_, hf_: hf_, vhf_: vhf_, l_h: l_h
    },
  ]
}
const HeartRateVariabilityFrequencyDomainMetrics: (props: {
  heartRateVariabilityFrequencyDomainMetrics: HeartRateVariabilityFrequencyDomainMetricsData
}) => JSX.Element = (props: {
  heartRateVariabilityFrequencyDomainMetrics: HeartRateVariabilityFrequencyDomainMetricsData
}) => {

    const data = props.heartRateVariabilityFrequencyDomainMetrics
    const frequencyPowers = data.frequencyPowers
    const tp = data.totalPower.toFixed(3)
    const vlf = frequencyPowers?.VL.toFixed(3)
    const lf = frequencyPowers?.L.toFixed(3)
    const mf = frequencyPowers?.M.toFixed(3)
    const hf = frequencyPowers?.H.toFixed(3)
    const vhf = frequencyPowers?.VH.toFixed(3)
    const topF = data.peakFrequency.toFixed(3)
    const topH = data.peakAmplitude.toFixed(3)

    const fNormalizedPowers = data.fNormalizedPowers
    const tp_ = 1
    const vlf_ = fNormalizedPowers?.VL.toFixed(3)
    const lf_ = fNormalizedPowers?.L.toFixed(3)
    const mf_ = fNormalizedPowers?.M.toFixed(3)
    const hf_ = fNormalizedPowers?.H.toFixed(3)
    const vhf_ = fNormalizedPowers?.VH.toFixed(3)
    const l_h = data.balanceIndex.toFixed(3)

    return (
      <>
        <h1>心跳间期统计学参数-时间域特征表</h1>
        <Table columns={columns} dataSource={renderData(tp, vlf, lf, mf, hf, vhf, topF, topH, tp_, vlf_, lf_, mf_, hf_, vhf_, l_h)} pagination={false}/>
      </>
    )
  };
export default HeartRateVariabilityFrequencyDomainMetrics;