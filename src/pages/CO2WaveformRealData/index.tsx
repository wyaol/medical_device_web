import React, {useEffect, useRef} from 'react';
import {useGlobalState} from '../../config/GlobalStateContext';
import {connectCO2SerialDevice, startDataCollector, stopDataCollector} from '../../service/co2SerialService';
import ReactEcharts from "echarts-for-react";
import {Button, message} from "antd";
import axios from "axios";
import storage from '../../storage';
import request from '../../config/request';
import {AxiosResponse} from 'axios';

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

const CO2WaveformRealData = () => {
    const {globalState, setGlobalState} = useGlobalState();
    const chartRef = useRef(null);

    const start = () => {
        const nowTime = new Date();
        startDataCollector(storage.deviceId).then(() => {
            setGlobalState({
                ...globalState,
                dataCollectionPeriod: {
                    ...globalState.dataCollectionPeriod,
                    startTime: nowTime
                }
            })
            message.success('开始采集');
        }).catch((error: Error) => {
            message.error(error.message);
        })
    }

    const stop = () => {
        const nowTime = new Date();
        stopDataCollector(storage.deviceId, globalState.dataCollectionPeriod.startTime, nowTime).then(() => {
            setGlobalState({
                ...globalState,
                dataCollectionPeriod: {
                    ...globalState.dataCollectionPeriod,
                    endTime: nowTime
                }
            })
            message.success('停止采集');
        }).catch((error: Error) => {
            message.error(error.message);
        })
    }

    useEffect(() => {
        // @ts-ignore
        chartRef?.current?.getEchartsInstance().setOption(renderCO2WaveformOption(globalState.co2WaveformData.curves));
    }, [globalState.co2WaveformData.curves])

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                <Button onClick={() => start()}>开始采集</Button>
                <Button onClick={() => stop()} style={{marginLeft: '10px'}}>停止采集</Button>
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

