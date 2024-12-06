import axios from "axios";
import request from "../config/request";
import {getCurrentPatient} from "../utils";

export const scanBrainWavesDevice = async (deviceId: string) => {
    const response = await request.get(`/brain_waves_device/${deviceId}/scan`);
    return response;
}

export const connectBrainWavesDevice = async (deviceId: string, address: string) => {
    const res = await request.post(`/brain_waves_device/${deviceId}/connect`, {address: address});
    return res;
}

export const disconnectBrainWavesDevice = async (deviceId: string) => {
    const res = await request.post(`/brain_waves_device/${deviceId}/disconnect`);
    return res;
}

export const startDataCollector = async (deviceId: string) => {
    if (getCurrentPatient()) {
        const response = await request.post(`/brain_waves_device/${deviceId}/start_collect`);
        return response;
    } else {
        throw new Error('请绑定病人');
    }
}

export const stopDataCollector = async (deviceId: string, startTime: Date | null, endTime: Date | null, fileName: string) => {
    let presignedUrl: string = '';
    await request.post(`/brain_waves_device/${deviceId}/stop_collect`, {
        'start_time': startTime,
        'end_time': endTime,
        'file_name': fileName
    }).then(res => presignedUrl = res.data.presigned_url);
    return presignedUrl;
}

export const getAllDataCollectionPeriods = async () => {
    try {
        const response = await request.get(`/brain_waves/data_collection_periods`);
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
        const response = await request.get(`/brain_waves/data_collection_periods/${periodId}/intervals`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('请绑定病人');
        }
        throw error;
    }
}

export const getBrainWavesRecordPresignedUrl = async (filename: string) => {
    let presignedUrl: string = '';
    await request.post(`/brain_waves/brain_waves_record`, {
        'file_name': filename
    }).then(res => presignedUrl = res.data.presigned_url);
    return presignedUrl;
}