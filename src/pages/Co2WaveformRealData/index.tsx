import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ReactEcharts from "echarts-for-react";
import { Button } from "antd";
import axios from "axios";

import Co2RealData1Table from '../../components/Co2RealData1Table';
import Co2RealData2Table from '../../components/Co2RealData2Table';



const renderCo2WaveformOption = (data: number[], time: any) => ({
  xAxis: {
    show: true,
    type: 'category',
  },
  yAxis: {
    type: 'value',
    max: 150,
    min: -10,
    // 减小y轴间距，通过增加分割数量
    // splitNumber: 10, // 原始默认可能为5或10，根据需求调整
  },
  series: [
    {
      name: 'Co2 Waveform',
      data: data.map((value, index) => [time[index], value]),
      type: 'line',
      showSymbol: false,
      smooth: true,
      color: 'orange'
    }
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#283b56'
      }
    }
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },

})


const renderETCo2WaveformOption = (data: number[], time: any) => ({
  xAxis: {
    show: true,
    type: 'category',
  },
  yAxis: {
    type: 'value',
    max: 50,
    min: 0,
  },
  series: [
    {
      name: 'ETCO2',
      data: data.map((value, index) => [time[index], value]),
      type: 'line',
      showSymbol: false,
      smooth: true
    }
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#283b56'
      }
    }
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },

})



const co2_start = () => {
  axios.create({baseURL: 'http://127.0.0.1:5000'}).get('api/co2/start').then(res => {})
}

const co2_stop = () => {
  axios.create({baseURL: 'http://127.0.0.1:5000'}).get('api/co2/stop').then(res => {})
}

const CO2WaveformRealData: React.FC = () => {
  const co2WaveformRef = useRef(null);
  const etco2WaveformRef = useRef(null);
  const [Co2RealData1, setCo2RealData1] = useState({
    co2_waveform: 0,
    interval: 0,
    dpi_info: { status: '', I_per_E: 0 }
  });

  const [Co2RealData2, setCo2RealData2] = useState({
    ETCO2: 0, RR: 0, FiCO2: 0,
  });

  let co2Waveform = new Array(60);
  let co2WaveformTime = new Array(60);
  let etco2Waveform = new Array(60);
  let etco2WaveformTime = new Array(60);
  let lastETCO2 = 0;

  useEffect(() => {
    const socket = io('ws://localhost:5000');

    // 监听来自服务器的Co2数据更新
    socket.on('co2_data_upload', (deviceData: Record<string, any>) => {
      co2Waveform = [...co2Waveform.slice(1), deviceData['co2_waveform']];
      co2WaveformTime = [...co2WaveformTime.slice(1), deviceData['time']];

      const dpi_info = deviceData['dpi_info'];
      // 创建一个新的对象来更新状态
      const updatedCo2RealData1 = {
        ...Co2RealData1,
        co2_waveform: deviceData['co2_waveform'],
        interval: deviceData['interval'],
        dpi_info: {
          ...Co2RealData1.dpi_info,
          ...(dpi_info?.status != undefined && { status: dpi_info.status }),
          ...(dpi_info?.I_per_E != undefined && { I_per_E: dpi_info.I_per_E })
        }
      };
      // @ts-ignore
      co2WaveformRef?.current?.getEchartsInstance().setOption(renderCo2WaveformOption(co2Waveform, co2WaveformTime));
      setCo2RealData1(updatedCo2RealData1)
    });


    socket.on('dpi_info_upload', (deviceData: Record<string, any>) => {
      if (deviceData['ETCO2'] !== undefined && deviceData['ETCO2'] !== lastETCO2) {
        lastETCO2 = deviceData['ETCO2']
        etco2Waveform = [...etco2Waveform.slice(1), lastETCO2];
        etco2WaveformTime = [...etco2WaveformTime.slice(1), deviceData['time']];
        // @ts-ignore
        etco2WaveformRef?.current?.getEchartsInstance().setOption(renderETCo2WaveformOption(etco2Waveform, etco2WaveformTime));
      }
      const updatedCo2RealData2 = {
        ...Co2RealData2,
        ...(deviceData['ETCO2'] !== undefined && { ETCO2: deviceData['ETCO2'] }),
        ...(deviceData['RR'] !== undefined && { RR: deviceData['RR'] }),
        ...(deviceData['FiCO2'] !== undefined && { FiCO2: deviceData['FiCO2'] }),
      };
      setCo2RealData2(updatedCo2RealData2)
    });


    return () => {
      socket.disconnect(); // 组件卸载时断开 WebSocket 连接
    };
  }, []);


  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        <Button onClick={() => co2_start()} >开始采集</Button>
        <Button onClick={() => co2_stop()} style={{ marginLeft: '10px' }}>停止采集</Button>
        <Button type="primary" onClick={() => {}} style={{ marginLeft: '50px'}}>设备扫描</Button>
      </div>
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "50%" }}>
          <Co2RealData1Table data={Co2RealData1}></Co2RealData1Table>
          <ReactEcharts
            notMerge={true}
            ref={co2WaveformRef}
            option={renderCo2WaveformOption(co2Waveform, co2WaveformTime)}
            style={{ height: '500px', width: '100%' }}
          />
        </div>
        <div style={{ width: "50%" }}>
          <Co2RealData2Table data={Co2RealData2}></Co2RealData2Table>
          <ReactEcharts
            notMerge={true}
            ref={etco2WaveformRef}
            option={renderETCo2WaveformOption(etco2Waveform, etco2WaveformTime)}
            style={{ height: '500px', width: '100%' }}
          />
        </div>
      </div>
    </div>
  )
};


export default CO2WaveformRealData;

