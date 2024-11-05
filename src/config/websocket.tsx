import React, {useEffect} from 'react';
import {useGlobalState} from './GlobalStateContext';
import {Storage} from '../storage'

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
                    setGlobalState({
                        ...globalState,
                        deviceId: data.data.toString()
                    });
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
                case 'co2_serial_devices_list':
                    setGlobalState((prevState: Storage) => ({
                        ...prevState,
                        co2Serial: {
                            ...prevState.co2Serial,
                            devices: data.data
                        }
                    }));
                    break;
                case 'co2_serial_devices_connect':
                    setGlobalState((prevState: Storage) => ({
                        ...prevState,
                        co2Serial: {
                            ...prevState.co2Serial,
                            connect: data.data
                        }
                    }));
                    break;
                case 'transfer_co2_waveform_data':
                    const responseData = data.data;
                    const curvesData = globalState.co2WaveformData.curves;
                    const indicatorsData = globalState.co2WaveformData.indicators;
                    const time = responseData['time_simple'];
                    if (!curvesData.co2WaveformTime.includes(time)) {
                        let co2Waveform = responseData['co2_waveform'];
                        curvesData.co2Waveform = curvesData.co2Waveform.length < 120 ? [...curvesData.co2Waveform, co2Waveform] : [...curvesData.co2Waveform.slice(1), co2Waveform];
                        curvesData.co2WaveformTime = curvesData.co2WaveformTime.length < 120 ? [...curvesData.co2WaveformTime, time] : [...curvesData.co2WaveformTime.slice(1), time];
                        if (responseData['render_etc']) {
                            curvesData.etco2Waveform = curvesData.etco2Waveform.length < 40 ? [...curvesData.etco2Waveform, responseData['ETCO2']] : [...curvesData.etco2Waveform.slice(1), responseData['ETCO2']];
                            curvesData.etco2WaveformTime = curvesData.etco2WaveformTime.length < 40 ? [...curvesData.etco2WaveformTime, time] : [...curvesData.etco2WaveformTime.slice(1), time];
                        }
                        setGlobalState((prevState: Storage) => ({
                            ...prevState,
                            co2WaveformData: {
                                ...prevState.co2WaveformData,
                                curves: curvesData,
                                indicators: {
                                    co2Waveform: co2Waveform ?? indicatorsData.co2Waveform,
                                    interval: responseData['interval'] ?? indicatorsData.interval,
                                    status: responseData['status'] ?? indicatorsData.status,
                                    I_per_E: responseData['I_per_E'] ?? indicatorsData.I_per_E,
                                    ETCO2: responseData['ETCO2'] ?? indicatorsData.ETCO2,
                                    RR: responseData['RR'] ?? indicatorsData.RR,
                                    FiCO2: responseData['FiCO2'] ?? indicatorsData.FiCO2
                                }
                            }
                        }));
                    }
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
