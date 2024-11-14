import axios from "axios";
import request from "../config/request";
import {getCurrentPatient} from "../utils";
import {IntervalAnalyse} from "../types";

export const connectPlusWaveDevice = async (deviceId: string, address: string) => {
  const res = await request.post(`/plus_wave/devices/${deviceId}/connect`, {uuid: address});
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

export const getRRIntervals = async (periodId: number | null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.get(`/plus_wave/data_collection_periods/${periodId}/rr_intervals`).then(res => res.data.data);
  return {
    rrIntervals: response['rr_intervals'],
    rrIntervalsAvarage: response['rr_intervals_average'],
    rrIntervalsIntervals: response['rr_intervals_intervals'],
    intervalsDensityData: {
      binCenters: response['intervals_density']['bin_centers'],
      counts: response['intervals_density']['counts'],
    },
  };
}

export const getMetrics = async (periodId: number | null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.get(`/plus_wave/data_collection_periods/${periodId}/metrics`).then(res => res.data.data);
  return response;
}

export const getTrend = async (periodId: number | null, timeInterval: number) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.post(`/plus_wave/data_collection_periods/${periodId}/trend`, {
    'time_interval': timeInterval
  }).then(res => res.data.data);
  return response;
}

export const getTimeDomainMetrics = async (periodId: number | null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.post(`/plus_wave/data_collection_periods/${periodId}/time_domain`).then(res => res.data.data);
  return response;
}

export const getPSD = async (periodId: number | null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.get(`/plus_wave/data_collection_periods/${periodId}/psd`).then(res => res.data.data);
  return {
    normalizedPsd: response['profile']['normalized_psd'],
    frequencies: response['profile']['frequencies'],
    histogram: response['histogram'],
  };
}

export const getFrequencyDomainMetrics = async (periodId: number | null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.post(`/plus_wave/data_collection_periods/${periodId}/frequency_domain`).then(res => res.data.data);
  return {
    totalPower: response['total_power'],
    frequencyPowers: response['frequency_powers'],
    peakFrequency: response['peak_frequency'],
    peakAmplitude: response['peak_amplitude'],
    fNormalizedPowers: response['f_normalized_powers'],
    balanceIndex: response['balance_index'],
  };
}

export const getHeartbeatIntervalScatterPlot = async (periodId: number | null) => {
  if (!periodId) throw new Error('请选择时间区间');
  const response = await request.get(`/plus_wave/data_collection_periods/${periodId}/rr_scatter`).then(res => res.data.data);
  return {
    x_data: response['x_data'],
    y_data: response['y_data'],
    symmetry_point1: response['point_1'],
    symmetry_point2: response['point_2'],
    angle: response['angle']
  };
}

export const getIntervalAnalyse = async (periodId: number | null) => {
  if (!periodId) throw new Error('请选择时间区间');
  let response;
  let res: IntervalAnalyse = {
    frequencies: [],
    intervalScatterDistributedPlotData: {x_data: [], y_data: []},
    intervalScatterPlotData: {angle: 0, symmetry_point1: [], symmetry_point2: [], x_data: [], y_data: []},
    intervalsDensityData: {binCenters: [], counts: []},
    normalizedPsd: [],
    psdHistogramData: [],
    rrIntervals: {rrIntervals: [], rrIntervalsAvarage: [], rrIntervalsIntervals: []}
  }
  response = await request.get(`/plus_wave/data_collection_periods/${periodId}/rr_scatter`).then(res => res.data.data);
  res.intervalScatterPlotData = {
    x_data: response['x_data'],
    y_data: response['y_data'],
    symmetry_point1: response['point_1'],
    symmetry_point2: response['point_2'],
    angle: response['angle']
  }
  res.intervalScatterDistributedPlotData = {
    x_data: response['x_data'],
    y_data: response['y_data'],
  }
  response = await request.get(`/plus_wave/data_collection_periods/${periodId}/psd`).then(res => res.data.data);
  const {VL, L, M, H, VH} = response['histogram']
  res.frequencies = response['profile']['frequencies'];
  res.normalizedPsd = response['profile']['normalized_psd'];
  res.psdHistogramData = [VL, L, M, H, VH];
  response = await request.get(`/plus_wave/data_collection_periods/${periodId}/rr_intervals`).then(res => res.data.data);
  res = {
    ...res,
    rrIntervals: {
      rrIntervals: response['rr_intervals'],
      rrIntervalsAvarage: response['rr_intervals_average'],
      rrIntervalsIntervals: response['rr_intervals_intervals'],
    },
    intervalsDensityData: {
      binCenters: response['intervals_density']['bin_centers'],
      counts: response['intervals_density']['counts'],
    },
  };

  return res;
}