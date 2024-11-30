import React, {useEffect, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import {useGlobalState} from '../../config/GlobalStateContext';
import {getRecordMinioObjectName,startRecord,compressEvents} from "../../utils";
import {putObjectByPresignedUrl} from '../../service/objectStoreService'
import ReactEcharts from "echarts-for-react";
import {Button, message, Modal, List, Alert, Flex} from "antd";
import storage from '../../storage';
import CO2RealDataTable from '../../components/CO2RealDataTable';
import {
    scanCO2SerialDevice,
    connectCO2SerialDevice,
    disconnectCO2SerialDevice,
    startDataCollector,
    stopDataCollector
} from '../../service/co2DataService';

const renderCO2WaveformOption = (data: {
    co2Waveform: number[],
    co2WaveformTime: string[],
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


const renderETCO2WaveformOption = (data: {
    etco2Waveform: number[],
    etco2WaveformTime: string[],
}) => ({
    xAxis: {
        show: true,
        type: 'category',
    },
    yAxis: {
        type: 'value',
        max: 25,
        min: 0,
    },
    series: [
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
    const bucketName = 'co2-serial-record-bucket';
    const {globalState, setGlobalState} = useGlobalState();
    const co2ChartRef = useRef(null);
    const etco2ChartRef = useRef(null);
    const recordingRef = useRef<any>(null);
    const eventsRef = useRef<any[]>([]);
    const elementsRef = useRef<NodeListOf<HTMLElement>>(document.querySelectorAll('.rr-block') as NodeListOf<HTMLElement>);
    const contextMenuListenerRef = useRef<(e: MouseEvent) => void>();
    const [modelVisible, setModelVisible] = useState<boolean>(false);
    const [indicators, setIndicators] = useState<any>(null);
    const [collectStatus, setCollectStatus] = useState<boolean>(false);
    const [devices, setDevices] = useState<Record<string, string>[]>([]);
    const [scanLoading, setScanLoading] = useState<boolean>(false);
    const [connectLoading, setConnectLoading] = useState<boolean>(false);
    const [connectedDevicePort, setConnectedDevicePort] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const start = async () => {
        const startTime = new Date();
        await startDataCollector(storage.deviceId)
            .then(() => {
                setGlobalState({
                    ...globalState,
                    co2WaveformData: {
                        ...globalState.co2WaveformData,
                        recordDuration: {
                            ...globalState.co2WaveformData.recordDuration,
                            startTime: startTime,
                            endTime: null
                        }
                    }
                })
                // 隐藏不必要的元素
                elementsRef.current.forEach(element => {
                    element.style.display = 'none';
                });
                // 开始录制
                recordingRef.current = startRecord(eventsRef.current);
            })
            .catch((error: Error) => {
                message.error(error.message);
            })
    }
    const stop = async () => {
        const endTime = new Date();
        const startTime = globalState.co2WaveformData.recordDuration.startTime;
        const fileName = getRecordMinioObjectName(startTime, endTime);

        // 停止录制
        if (recordingRef.current) {
            recordingRef.current();
        }
        // 复原元素
        elementsRef.current.forEach(element => {
            element.style.display = 'block';
        });
        const presignedUrl = await stopDataCollector(storage.deviceId, startTime, endTime, fileName)
        setGlobalState({
            ...globalState,
            co2WaveformData: {
                ...globalState.co2WaveformData,
                recordDuration: {
                    ...globalState.co2WaveformData.recordDuration,
                    startTime: null,
                    endTime: null,
                }
            }
        })
        const data = compressEvents(eventsRef.current)
        if (data) {
            await putObjectByPresignedUrl(presignedUrl, fileName, data);
        }
    }
    useEffect(() => {
        // @ts-ignore
        co2ChartRef?.current?.getEchartsInstance().setOption(renderCO2WaveformOption({
            co2Waveform: globalState.co2WaveformData.curves.co2Waveform,
            co2WaveformTime: globalState.co2WaveformData.curves.co2WaveformTime
        }));
        // @ts-ignore
        etco2ChartRef?.current?.getEchartsInstance().setOption(renderETCO2WaveformOption({
            etco2Waveform: globalState.co2WaveformData.curves.etco2Waveform,
            etco2WaveformTime: globalState.co2WaveformData.curves.etco2WaveformTime
        }));
    }, [globalState.co2WaveformData.curves])

    useEffect(() => {
        if (globalState.co2WaveformData.recordDuration.startTime !== null) {
            setCollectStatus(true);
        } else {
            setCollectStatus(false);
        }
    }, [globalState.co2WaveformData.recordDuration.startTime])

    useEffect(() => {
        setDevices(globalState.co2Serial.devices);
        setConnectedDevicePort(globalState.co2Serial.connect.port);
    }, [globalState.co2Serial.devices, globalState.co2Serial.connect.port])

    useEffect(() => {
        setDevices(globalState.co2Serial.devices);
        setScanLoading(false);
    }, [globalState.co2Serial.devices])

    useEffect(() => {
        if (storage.plusWave.connect.message !== '') {
            alert(globalState.co2Serial.connect.message)
        }
        setConnectedDevicePort(globalState.co2Serial.connect.port);
        setConnectLoading(false);
    }, [globalState.co2Serial.connect])

    useEffect(() => {
        setIndicators(globalState.co2WaveformData.indicators)
    }, [globalState.co2WaveformData.indicators])

    useEffect(() => {
        // 在组件挂载时禁用鼠标右键
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // 存储监听器以便在卸载时移除
        contextMenuListenerRef.current = handleContextMenu;

        // 清理函数，在组件卸载时移除事件监听器
        return () => {
            if (contextMenuListenerRef.current) {
                document.removeEventListener('contextmenu', contextMenuListenerRef.current);
            }
        };
    }, []); // 空依赖数组确保此effect仅运行一次

    return (
        <div
            className={"co2-waveform-real-data-container"}
            style={{display: "flex", flexDirection: "column"}}
        >
            <Flex justify={"space-between"} align={"center"}>
                <Button
                    disabled={collectStatus}
                    type="primary"
                    onClick={() => setModelVisible(true)}
                    style={{marginRight: '50px'}}
                >设备管理</Button>
                <Flex>
                    <Button
                        disabled={collectStatus}
                        onClick={() => start()}
                    >开始记录</Button>
                    <Button
                        onClick={() => stop()}
                        style={{marginLeft: '20px'}}
                    >停止记录</Button>
                </Flex>
                <Modal
                    title={(
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>设备管理</div>)}
                    width={800}
                    style={{top: '20vh'}}
                    open={modelVisible}
                    onOk={() => {
                        setModelVisible(false)
                    }}
                    onCancel={() => {
                        setModelVisible(false)
                    }}
                >
                    <Flex
                        gap="middle"
                        vertical={false}
                        justify="space-between" // 将内容水平分布
                        align="center" // 垂直居中对齐
                    >
                        <p>可连接CO2串口设备列表</p>
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
                    </Flex>
                    <List
                        itemLayout="horizontal"
                        dataSource={devices}
                        renderItem={(item) => (
                            <List.Item
                                key={item.port}
                                actions={[
                                    (connectedDevicePort === null || connectedDevicePort === item.port) &&
                                    (<Button
                                        loading={connectLoading}
                                        danger={connectedDevicePort === item.port}
                                        onClick={async () => {
                                            if (connectedDevicePort === null) {
                                                setConnectLoading(true);
                                                await connectCO2SerialDevice(storage.deviceId, item.port)
                                                    .catch((err) => {
                                                        setError(err.message);
                                                        setConnectLoading(false);
                                                    });
                                            } else {
                                                await disconnectCO2SerialDevice(storage.deviceId)
                                                    .then((res: AxiosResponse<any>) => {
                                                        if (res.status !== 200) {
                                                            throw new Error('Disconnect failed');
                                                        }
                                                        setConnectedDevicePort(null)
                                                    })
                                                    .catch((err) => {
                                                        setError(err.message);
                                                    });
                                            }
                                        }}
                                    >{connectedDevicePort !== null && connectedDevicePort === item.port ? "断开连接" : "连接"}
                                    </Button>)
                                ]}
                            >
                                <List.Item.Meta
                                    title={`端口：${item.port}`}
                                    description={<><p>描述：{item.desc}</p><p>硬件标识：{item.hwid}</p></>}
                                />
                            </List.Item>
                        )}
                    />
                </Modal>
            </Flex>
            <CO2RealDataTable data={indicators}/>
            <Flex justify={"space-between"} align={"center"}>
                <ReactEcharts
                    notMerge={true}
                    ref={co2ChartRef}
                    option={renderCO2WaveformOption(globalState.co2WaveformData.curves)}
                    style={{height: '500px', width: '100%'}}
                />
                <ReactEcharts
                    notMerge={true}
                    ref={etco2ChartRef}
                    option={renderETCO2WaveformOption(globalState.co2WaveformData.curves)}
                    style={{height: '500px', width: '100%'}}
                />
            </Flex>
        </div>
    )
}


export default CO2WaveformRealData;

