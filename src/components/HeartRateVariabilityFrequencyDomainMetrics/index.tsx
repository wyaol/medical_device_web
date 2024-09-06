import { Table, TableProps } from 'antd';
import * as React from 'react';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   fontWeight: 'bold',
//   fontSize: '1.5em', // 或者使用主题中的单位，例如：theme.typography.h6.fontSize
// }));


// const HeartRateVariabilityFrequencyDomainMetrics: React.FC<{
//   data: {
//     balance_index: number, peak_amplitude: number, peak_frequency: number, total_power: number
//     f_normalized_powers: {
//       H: number, L: number, M: number, VH: number, VL: number,
//     },
//     frequency_powers: {
//       H: number, L: number, M: number, VH: number, VL: number,
//     },
//   }
// }> = ({ data }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 700 }} aria-label="spanning table">
//         <TableHead>
//           <TableRow>
//             <StyledTableCell align="center" colSpan={8} >植物神经性反应检测数据列表</StyledTableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           <TableRow>
//             <TableCell align="center" >总功率<br />(TP)</TableCell>
//             <TableCell align="center">超低频功率<br />(VLF)</TableCell>
//             <TableCell align="center">低频功率<br />(LF)</TableCell>
//             <TableCell align="center">中频功率<br />(MF)</TableCell>
//             <TableCell align="center">高频功率<br />(HF)</TableCell>
//             <TableCell align="center">超高频功率<br />(VHF)</TableCell>
//             <TableCell align="center">峰值频率<br />(TOP_F)</TableCell>
//             <TableCell align="center">峰值幅度<br />(TOP_H)</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell align="center">{data.total_power.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.frequency_powers.VL.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.frequency_powers.L.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.frequency_powers.M.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.frequency_powers.H.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.frequency_powers.VH.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.peak_frequency.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.peak_amplitude.toFixed(2)}</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell align="center">总功率%<br />(TP%)</TableCell>
//             <TableCell align="center">超低频功率%<br />(VLF%)</TableCell>
//             <TableCell align="center">低频功率%<br />(LF%)</TableCell>
//             <TableCell align="center">中频功率%<br />(MF%)</TableCell>
//             <TableCell align="center">高频功率%<br />(HF%)</TableCell>
//             <TableCell align="center">超高频功率%<br />(VHF%)</TableCell>
//             <TableCell align="center">平衡指数<br />(L/H)</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell align="center">1.00</TableCell>
//             <TableCell align="center">{data.f_normalized_powers.VL.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.f_normalized_powers.L.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.f_normalized_powers.M.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.f_normalized_powers.H.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.f_normalized_powers.VH.toFixed(2)}</TableCell>
//             <TableCell align="center">{data.balance_index.toFixed(2)}</TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

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
        <Table columns={columns} dataSource={renderData(tp, vlf, lf, mf, hf, vhf, topF, topH, tp_, vlf_, lf_, mf_, hf_, vhf_, l_h)} />
      </>
    )
  };
export default HeartRateVariabilityFrequencyDomainMetrics;