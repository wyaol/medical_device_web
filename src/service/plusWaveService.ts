import { AxiosResponse } from "axios";
import request from "../config/request";
import { getCurrentPatient } from "../utils";

export const connectPlusWaveDevice = async (deviceId: string, address: string) => {
    const res = await request.post(`/plus_wave/devices/${deviceId}/connect`, { uuid: address });
    if (res.status !== 200) {
        throw new Error('Connection failed');
    }
}

export const startDataCollector = async (deviceId: string) => {
    if (getCurrentPatient()) {
        await request.post(`/plus_wave/devices/${deviceId}/start`);
    } else {
        throw new Error('请绑定病人');
    }
}

export const stopDataCollector = async (deviceId: string, startTime: Date | null, endTime: Date | null) => {
    await request.post(`/plus_wave/devices/${deviceId}/stop`, {
        'start_time': startTime,
        'end_time': endTime
    });
}

export const createPatient = async (patient: Record<string, any>) => {
    await request.post(`/plus_wave/patients`, patient);
}

export const getAllPatient = async () => {
    return await request.get(`/plus_wave/patients`).then(res => res.data.data);
}

export const bindPatient = async (patientId: string, deviceid: string) => {
    return await request.post(`/plus_wave/current_patient`, {
        'patient_id': patientId,
        'device_id': deviceid,
    }).then(res => res.data.data);
}
