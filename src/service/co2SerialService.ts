import axios from "axios";
import request from "../config/request";
import {getCurrentPatient} from "../utils";

export const connectCO2SerialDevice = async (deviceId: string, port: string) => {
    const res = await request.post(`/co2_serial_device/${deviceId}/connect`, {uuid: port});
    if (res.status !== 200) {
        throw new Error('Connection failed');
    }
}

export const startDataCollector = async (deviceId: string) => {
    if (getCurrentPatient()) {
        await request.post(`/co2_serial_device/${deviceId}/start_collect`);
    } else {
        throw new Error('请绑定病人');
    }
}

export const stopDataCollector = async (deviceId: string, startTime: Date | null, endTime: Date | null) => {
    await request.post(`/co2_serial_device/${deviceId}/stop_collect`, {
        'start_time': startTime,
        'end_time': endTime
    });
}

export const getAllDataCollectionPeriods = async () => {
    try {
        const response = await request.get(`/co2_serial/data_collection_periods`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('请绑定病人');
        }
        throw error;
    }
}