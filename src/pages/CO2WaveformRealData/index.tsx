import React, {useEffect, useRef} from 'react';
import {useGlobalState} from '../../config/GlobalStateContext';
import ReactEcharts from "echarts-for-react";
import {Button} from "antd";
import axios from "axios";

import CO2RealDataTable from '../../components/CO2RealDataTable';

const renderCO2WaveformOption = (data: {
    co2Waveform: number[],
    co2WaveformTime: string[],
    etco2Waveform: number[],
    etco2WaveformTime: string[],
}) => ({
    xAxis: {
        show: true,
        type: 'category',
    },
    yAxis: {
        type: 'value',
        max: 150,
        min: -10,
    },
    series: [
        {
            name: 'CO2 Waveform',
            data: data.co2Waveform.map((value, index) => [data.co2WaveformTime[index], value]),
            type: 'line',
            showSymbol: false,
            smooth: true,
            color: 'green'
        },
        {
            name: 'ETCO2',
            data: data.etco2Waveform.map((value, index) => [data.etco2WaveformTime[index], value]),
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
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
})


const co2_start = () => {
    axios.create({baseURL: 'http://127.0.0.1:5000'}).get('api/co2/start').then(res => {
    })
}

const co2_stop = () => {
    axios.create({baseURL: 'http://127.0.0.1:5000'}).get('api/co2/stop').then(res => {
    })
}

const CO2WaveformRealData = () => {
    const {globalState} = useGlobalState();
    const chartRef = useRef(null);

    useEffect(() => {
        // @ts-ignore
        chartRef?.current?.getEchartsInstance().setOption(renderCO2WaveformOption(globalState.co2WaveformData.curves));
    }, [globalState.co2WaveformData.curves])

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                <Button onClick={() => co2_start()}>开始采集</Button>
                <Button onClick={() => co2_stop()} style={{marginLeft: '10px'}}>停止采集</Button>
                <Button type="primary" onClick={() => {
                }} style={{marginLeft: '50px'}}>设备扫描</Button>
            </div>
            <div style={{width: "100%", display: "flex"}}>
                <div style={{width: "100%"}}>
                    <CO2RealDataTable data={globalState.co2WaveformData.indicators}></CO2RealDataTable>
                    <ReactEcharts
                        notMerge={true}
                        ref={chartRef}
                        option={renderCO2WaveformOption(globalState.co2WaveformData.curves)}
                        style={{height: '500px', width: '100%'}}
                    />
                </div>
            </div>
        </div>
    )
}


export default CO2WaveformRealData;

