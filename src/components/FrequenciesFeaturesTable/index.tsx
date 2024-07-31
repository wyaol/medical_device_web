import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5em', // 或者使用主题中的单位，例如：theme.typography.h6.fontSize
}));


const FrequenciesFeaturesTable: React.FC<{
  data: {
    balance_index: number,peak_amplitude: number,peak_frequency: number,total_power: number
    f_normalized_powers: {
      H: number,L: number,M: number,VH: number,VL: number,
    },
    frequency_powers: {
      H: number,L: number,M: number,VH: number,VL: number,
    },
  }
}> = ({ data}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" colSpan={8} >植物神经性反应检测数据列表</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" >总功率<br/>(TP)</TableCell>
            <TableCell align="center">超低频功率<br/>(VLF)</TableCell>
            <TableCell align="center">低频功率<br/>(LF)</TableCell>
            <TableCell align="center">中频功率<br/>(MF)</TableCell>
            <TableCell align="center">高频功率<br/>(HF)</TableCell>
            <TableCell align="center">超高频功率<br/>(VHF)</TableCell>
            <TableCell align="center">峰值频率<br/>(TOP_F)</TableCell>
            <TableCell align="center">峰值幅度<br/>(TOP_H)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">{data.total_power.toFixed(2)}</TableCell>
            <TableCell align="center">{data.frequency_powers.VL.toFixed(2)}</TableCell>
            <TableCell align="center">{data.frequency_powers.L.toFixed(2)}</TableCell>
            <TableCell align="center">{data.frequency_powers.M.toFixed(2)}</TableCell>
            <TableCell align="center">{data.frequency_powers.H.toFixed(2)}</TableCell>
            <TableCell align="center">{data.frequency_powers.VH.toFixed(2)}</TableCell>
            <TableCell align="center">{data.peak_frequency.toFixed(2)}</TableCell>
            <TableCell align="center">{data.peak_amplitude.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">总功率%<br/>(TP%)</TableCell>
            <TableCell align="center">超低频功率%<br/>(VLF%)</TableCell>
            <TableCell align="center">低频功率%<br/>(LF%)</TableCell>
            <TableCell align="center">中频功率%<br/>(MF%)</TableCell>
            <TableCell align="center">高频功率%<br/>(HF%)</TableCell>
            <TableCell align="center">超高频功率%<br/>(VHF%)</TableCell>
            <TableCell align="center">平衡指数<br/>(L/H)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">1.00</TableCell>
            <TableCell align="center">{data.f_normalized_powers.VL.toFixed(2)}</TableCell>
            <TableCell align="center">{data.f_normalized_powers.L.toFixed(2)}</TableCell>
            <TableCell align="center">{data.f_normalized_powers.M.toFixed(2)}</TableCell>
            <TableCell align="center">{data.f_normalized_powers.H.toFixed(2)}</TableCell>
            <TableCell align="center">{data.f_normalized_powers.VH.toFixed(2)}</TableCell>
            <TableCell align="center">{data.balance_index.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}




export default FrequenciesFeaturesTable;