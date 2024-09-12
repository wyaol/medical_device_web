import React, {useEffect} from 'react';
import {useGlobalState} from './GlobalStateContext';
import {Storage} from '../storage';

const WebSocketComponent = () => {
    const {globalState, setGlobalState} = useGlobalState();

    useEffect(() => {

        const socket = new WebSocket(`ws://${process.env.REACT_APP_GATEWAT_WBEBSOCKT_HOST}:${process.env.REACT_APP_GATEWAT_WBEBSOCKT_PORT}`);

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            // 发送事件数据
            const eventData = {
                event: 'acquire_gateway_device_id'
            };
            socket.send(JSON.stringify(eventData));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.event) {
                case 'gateway_device_id':
                    console.log(data);
                    setGlobalState((prevState: Storage) => ({
                        ...prevState,
                        deviceId: data.data
                    }));
                    break;
                case 'plus_wave_bluetooth_list':
                    setGlobalState((prevState: Storage) => ({
                        ...prevState,
                        plusWave: {
                            ...prevState.plusWave,
                            bluetooth: data.data
                        }
                    }));
                    break;
                case 'plus_wave_bluetooth_connected':
                    setGlobalState((prevState: Storage) => ({
                        ...prevState,
                        plusWave: {
                            ...prevState.plusWave,
                            connect: data.data
                        }
                    }));
                    break;
                case 'plus_wave_data_upload':
                    const deviceData = data.data;
                    const newData = globalState.plusWave.data;

                    Object.keys(newData).forEach((key: string) => {
                        if (deviceData[key] !== 0) {
                            newData[key] = [...newData[key].slice(1), deviceData[key]];
                        } else {
                            newData[key] = [...newData[key].slice(1), newData[key][newData[key].length - 1]];
                        }
                    })

                    setGlobalState((prevState: Storage) => ({
                        ...prevState,
                        plusWave: {
                            ...prevState.plusWave,
                            data: newData
                        }
                    }));
                    break;
                case 'transfer_co2_waveform_data':
                    const responseData = data.data;
                    const curvesData = globalState.co2WaveformData.curves;
                    const indicatorsData = globalState.co2WaveformData.indicators;
                    let co2Waveform = responseData['co2_waveform'];
                    let dpiInfo = responseData['dpi_info'];
                    curvesData.co2Waveform = [...curvesData.co2Waveform.slice(1), co2Waveform];
                    curvesData.co2WaveformTime = [...curvesData.co2WaveformTime.slice(1), responseData['time']];
                    if (dpiInfo['render_etc']) {
                        curvesData.etco2Waveform = [...curvesData.etco2Waveform.slice(1), dpiInfo['ETCO2']];
                        curvesData.etco2WaveformTime = [...curvesData.etco2WaveformTime.slice(1), responseData['time']];
                    }
                    setGlobalState((prevState: Storage) => ({
                        ...prevState,
                        co2WaveformData: {
                            ...prevState.co2WaveformData,
                            curves: curvesData,
                            indicators: {
                                co2Waveform: co2Waveform ?? indicatorsData.co2Waveform,
                                interval: responseData['interval'] ?? indicatorsData.interval,
                                status: dpiInfo['status'] ?? indicatorsData.status,
                                I_per_E: dpiInfo['I_per_E'] ?? indicatorsData.I_per_E,
                                ETCO2: dpiInfo['ETCO2'] ?? indicatorsData.ETCO2,
                                RR: dpiInfo['RR'] ?? indicatorsData.RR,
                                FiCO2: dpiInfo['FiCO2'] ?? indicatorsData.FiCO2
                            }
                        }
                    }));
                    break;
                default:
                    console.log(data.event);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };


        // Cleanup WebSocket on unmount or dependencies change
        return () => {
            socket.close();
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <div></div>
    );
};

export default WebSocketComponent;
