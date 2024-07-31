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

const Co2RealData1Table: React.FC<{
  data: {
    co2_waveform: number,
    interval: number,
    dpi_info: { status: string, I_per_E: number }
  }
}> = ({ data }) => {
  return (
    <TableContainer component={Paper}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', width: 720 }}
    >
      <Table aria-label="spanning table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" colSpan={4} >CO2实时波形数据</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" width={180} height={74}>Co2</TableCell>
            <TableCell align="center" width={180} height={74}>状态</TableCell>
            <TableCell align="center" width={180} height={74}>I:E</TableCell>
            <TableCell align="center" width={180} height={74}>间隔</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" width={180}>{data.co2_waveform.toFixed(2)}</TableCell>
            <TableCell align="center" width={180}>{data.dpi_info?.status || ''}</TableCell>
            <TableCell align="center" width={180}>{data.dpi_info?.I_per_E?.toFixed(2) || ''}</TableCell>
            <TableCell align="center" width={180}>{data.interval.toFixed(2)}s</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}




export default Co2RealData1Table;