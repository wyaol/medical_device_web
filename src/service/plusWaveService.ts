import axios from "axios";
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

export const getAllDataCollectionPeriods = async () => {
  try {
    const response = await request.get(`/plus_wave/data_collection_periods`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('请绑定病人');
    }
    throw error;
  }

}

export const getRRIntervals = async (periodId: number|null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.get(`/plus_wave/data_collection_periods/${periodId}/rr_intervals`).then(res => res.data.data);
  return {
    rrIntervals: response['rr_intervals'],
    rrIntervalsAvarage: response['rr_intervals_average'],
    rrIntervalsIntervals: response['rr_intervals_intervals'],
    intervalsDensityData: response['intervals_density'],
  };
}

export const getMetrics = async (periodId: number|null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.get(`/plus_wave/data_collection_periods/${periodId}/metrics`).then(res => res.data.data);
  return response;
}

export const getTrend = async (periodId: number|null, timeInterval: number) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.post(`/plus_wave/data_collection_periods/${periodId}/trend`, {
    'time_interval': timeInterval
  }).then(res => res.data.data);
  return response;
}

export const getTimeDomainMetrics = async (periodId: number|null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.post(`/plus_wave/data_collection_periods/${periodId}/time_domain`).then(res => res.data.data);
  return response;
}