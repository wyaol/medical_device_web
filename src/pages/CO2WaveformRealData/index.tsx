import React, {useEffect, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import {useGlobalState} from '../../config/GlobalStateContext';
import {getCO2RecordMinioObjectName} from "../../utils";
import {putObjectByPresignedUrl} from '../../service/objectStoreService'
import ReactEcharts from "echarts-for-react";
import {Button, message, Modal, List, Alert} from "antd";
import storage from '../../storage';
import CO2RealDataTable from '../../components/CO2RealDataTable';
import * as rrweb from 'rrweb';
import Gzip from 'gzip-js';
import {
    connectCO2SerialDevice,
    scanCO2SerialDevice,
    startDataCollector,
    stopDataCollector
} from '../../service/co2DataService';

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


const compressEvents = (events: any[]): Blob | null => {
    try {
        const eventsJson = JSON.stringify(events);
        const encodedData = new TextEncoder().encode(eventsJson);
        const compressedData = new Uint8Array(Gzip.zip(encodedData));
        return new Blob([compressedData], {type: 'application/octet-stream'});
    } catch (error) {
        console.error('Error compressing events:', error);
        return null;
    }
}
const startRecord = (events: any[]) => {
    return rrweb.record({
        // emit 回调函数
        emit: (event) => {
            events.push(event)
        },
        blockClass: 'rr-block',
        blockSelector: 'rr-block',
        // 配置抽样策略
        sampling: {
            // 不录制鼠标移动事件
            mousemove: false,
            // 定义不录制的鼠标交互事件类型，可以细粒度的开启或关闭对应交互录制
            mouseInteraction: {
                MouseUp: false,
                MouseDown: false,
                Click: false,
                ContextMenu: false,
                DblClick: false,
                Focus: false,
                Blur: false,
                TouchStart: false,
                TouchEnd: false,
            },
            // 设置滚动事件的触发频率
            scroll: 150, // 每 150ms 最多触发一次
            media: 800,
            // 设置输入事件的录制时机
            input: 'last' // 连续输入时，只录制最终值
        },
        slimDOMOptions: {
            script: false,
            comment: false,
            headFavicon: false,
            headWhitespace: false,
            headMetaDescKeywords: false,
            headMetaSocial: false,
            headMetaRobots: false,
            headMetaHttpEquiv: false,
            headMetaAuthorship: false,
            headMetaVerification: false,
        }
    });
}

const CO2WaveformRealData = () => {
    const bucketName = 'co2-serial-record-bucket';
    const {globalState, setGlobalState} = useGlobalState();
    const chartRef = useRef(null);
    const recordingRef = useRef<any>(null);
    const eventsRef = useRef<any[]>([]);
    const elementsRef = useRef<NodeListOf<HTMLElement>>(document.querySelectorAll('.rr-block') as NodeListOf<HTMLElement>);
    const [visible, setVisible] = useState(false);
    const [devices, setDevices] = useState<Record<string, string>[]>([]);
    const [scanLoading, setScanLoading] = useState(false);
    const [connectLoading, setConnectLoading] = useState(false);
    const [connectStatus, setConnectStatus] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const start = () => {
        const nowTime = new Date();
        startDataCollector(storage.deviceId).then(async () => {
                setGlobalState({
                    ...globalState,
                    co2WaveformData: {
                        ...globalState.co2WaveformData,
                        recordDuration: {
                            ...globalState.co2WaveformData.recordDuration,
                            startTime: nowTime,
                            endTime: null
                        }
                    }
                })
                message.success('开始采集');
            }
        ).catch((error: Error) => {
            message.error(error.message);
        })
        // 隐藏不必要的元素
        elementsRef.current.forEach(element => {
            element.style.display = 'none';
        });
        // 开始录制
        recordingRef.current = startRecord(eventsRef.current);
    }
    const stop = async () => {
        const nowTime = new Date();
        const startTime = globalState.co2WaveformData.recordDuration.startTime;
        const fileName = getCO2RecordMinioObjectName(startTime, nowTime);

        // 停止录制
        if (recordingRef.current) {
            recordingRef.current();
        }
        // 复原元素
        elementsRef.current.forEach(element => {
            element.style.display = 'block';
        });

        const presignedUrl = await stopDataCollector(storage.deviceId, startTime, nowTime, fileName)
        setGlobalState({
            ...globalState,
            co2WaveformData: {
                ...globalState.co2WaveformData,
                recordDuration: {
                    ...globalState.co2WaveformData.recordDuration,
                    endTime: nowTime,
                }
            }
        })
        message.success('停止采集');
        const data = compressEvents(eventsRef.current)
        if (data) {
            await putObjectByPresignedUrl(presignedUrl, fileName, data);
        }
    }
    useEffect(() => {
        // @ts-ignore
        chartRef?.current?.getEchartsInstance().setOption(renderCO2WaveformOption(globalState.co2WaveformData.curves));
    }, [globalState.co2WaveformData.curves, visible])

    useEffect(() => {
        setDevices(globalState.co2Serial.devices);
        setConnectStatus(globalState.co2Serial.connect.success);
    }, [globalState.co2Serial.devices, globalState.co2Serial.connect.success])

    useEffect(() => {
        setDevices(globalState.co2Serial.devices);
        setScanLoading(false);
    }, [globalState.co2Serial.devices])

    useEffect(() => {
        if (storage.plusWave.connect.message !== '') {
            alert(globalState.co2Serial.connect.message)
        } else {
            setConnectStatus(globalState.co2Serial.connect.success);
        }
        setConnectLoading(false);
    }, [globalState.co2Serial.connect])

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                <Button onClick={() => start()}>开始采集</Button>
                <Button onClick={() => stop()} style={{marginLeft: '10px'}}>停止采集</Button>
                <Button type="primary" onClick={() => setVisible(true)} style={{marginLeft: '50px'}}>设备管理</Button>
                <Modal
                    title="设备管理"
                    width={800}
                    style={{top: '20vh'}}
                    open={visible}
                    onOk={() => {
                        setVisible(false)
                    }}
                    onCancel={() => {
                        setVisible(false)
                    }}
                >
                    <Button type="primary"
                            style={{marginLeft: '50px'}}
                            loading={scanLoading}
                            onClick={async () => {
                                setScanLoading(true);
                                await scanCO2SerialDevice(storage.deviceId)
                                    .then((res: AxiosResponse<any>) => {
                                        if (res.status !== 200) {
                                            throw new Error('Scan failed');
                                        }
                                    })
                                    .catch((err) => {
                                        setScanLoading(false);
                                        setError(err.message);
                                    });
                            }}
                    >设备扫描</Button>
                    <List
                        itemLayout="horizontal"
                        dataSource={devices}
                        renderItem={(item) => (
                            <List.Item
                                key={item.port}
                                actions={[<Button onClick={() => {}}>连接</Button>]}
                            >
                                <List.Item.Meta
                                    title={`端口：${item.port}`}
                                    description={<><p>描述：{item.desc}</p><p>硬件标识：{item.hwid}</p></>}
                                />
                            </List.Item>
                        )}
                    />
                </Modal>
            </div>
            <div style={{width: "100%", display: "flex"}} className="co2-record">
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

