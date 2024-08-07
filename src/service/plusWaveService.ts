import { AxiosResponse } from "axios";
import request from "../config/request";

export const connectPlusWaveDevice = async (deviceId: string, address: string) => {
    const res = await request.post(`/plus_wave/devices/${deviceId}/connect`, { uuid: address });
    if (res.status !== 200) {
        throw new Error('Connection failed');
    }
}

export const startDataCollector = async (deviceId: string) => {
    await request.post(`/plus_wave/devices/${deviceId}/start`);
}

export const stopDataCollector = async (deviceId: string) => {
    await request.post(`/plus_wave/devices/${deviceId}/stop`);
}

