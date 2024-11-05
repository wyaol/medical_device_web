import axios from "axios";
import request from "../config/request";
import {getCurrentPatient} from "../utils";

export const scanCO2SerialDevice = async (deviceId: string) => {
    const response = await request.get(`/co2_serial_device/${deviceId}/scan_serial`);
    return response;
}

export const connectCO2SerialDevice = async (deviceId: string, port: string) => {
    const res = await request.post(`/co2_serial_device/${deviceId}/connect`, {port: port});
    return res;
}

export const disconnectCO2SerialDevice = async (deviceId: string) => {
    const res = await request.post(`/co2_serial_device/${deviceId}/disconnect`);
    return res;
}

export const startDataCollector = async (deviceId: string) => {
    if (getCurrentPatient()) {
        const response = await request.post(`/co2_serial_device/${deviceId}/start_collect`);
        return response;
    } else {
        throw new Error('请绑定病人');
    }
}

export const stopDataCollector = async (deviceId: string, startTime: Date | null, endTime: Date | null, fileName: string) => {
    let presignedUrl: string = '';
    await request.post(`/co2_serial_device/${deviceId}/stop_collect`, {
        'start_time': startTime,
        'end_time': endTime,
        'file_name': fileName
    }).then(res => presignedUrl = res.data.presigned_url);
    return presignedUrl;
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

export const getIntervals = async (periodId: number | null) => {
    try {
        const response = await request.get(`/co2_serial/data_collection_periods/${periodId}/intervals`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('请绑定病人');
        }
        throw error;
    }
}

export const getCO2DataRecordPresignedUrl = async (filename: string) => {
    let presignedUrl: string = '';
    await request.post(`/co2_serial/co2_data_record`, {
        'file_name': filename
    }).then(res => presignedUrl = res.data.presigned_url);
    return presignedUrl;
}