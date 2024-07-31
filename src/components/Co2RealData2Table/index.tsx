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

const Co2RealData2Table: React.FC<{
    data: {ETCO2:number,RR:number,FiCO2:number}
  }> = ({ data}) => {
    return (
      <TableContainer component={Paper}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', width: 720 }}
      >
        <Table aria-label="spanning table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={3} >CO2实时指标数据</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center" width={240} height={74}>呼末 CO2 浓度值<br/>(ETCO2)</TableCell>
              <TableCell align="center" width={240} height={74}>呼吸率<br/>(RR)</TableCell>
              <TableCell align="center" width={240} height={74}>吸入 CO2 浓度值<br/>(FiCO2)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" width={240}>{data.ETCO2?.toFixed(2) || ''}</TableCell>
              <TableCell align="center" width={240}>{data.RR?.toFixed(2) || ''}</TableCell>
              <TableCell align="center" width={240}>{data.FiCO2?.toFixed(2) || ''}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  
  
  
  export default Co2RealData2Table;