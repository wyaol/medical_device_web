import {IntervalAnalyse} from "../types";
import request from "../config/request";

export const getIntervalAnalyseByType = async (periodId: number | null, intervalType: string) => {
  if (!periodId) throw new Error('请选择时间区间');
  let res: IntervalAnalyse = {
    frequencies: [],
    intervalScatterDistributedPlotData: {x_data: [], y_data: []},
    intervalScatterPlotData: {angle: 0, symmetry_point1: [], symmetry_point2: [], x_data: [], y_data: []},
    intervalsDensityData: {binCenters: [], counts: []},
    normalizedPsd: [],
    psdHistogramData: [],
    rrIntervals: {rrIntervals: [], rrIntervalsAvarage: [], rrIntervalsIntervals: []}
  }
  const response = await request.get(`/intervals/${intervalType}/data_collection_periods/${periodId}/analyse`).then(res => {
    return res.data.data;
  });
  res.intervalScatterPlotData = {
    x_data: response['interval_scatter_plot_data']['x_data'],
    y_data: response['interval_scatter_plot_data']['y_data'],
    symmetry_point1: response['interval_scatter_plot_data']['point_1'],
    symmetry_point2: response['interval_scatter_plot_data']['point_2'],
    angle: response['interval_scatter_plot_data']['angle']
  }
  res.intervalScatterDistributedPlotData = response['interval_scatter_distributed_plot_data']
  const {VL, L, M, H, VH} = response['psd_histogram_data']
  res.frequencies = response['frequencies'];
  res.normalizedPsd = response['normalized_psd'];
  res.psdHistogramData = [VL, L, M, H, VH];
  res = {
    ...res,
    rrIntervals: {
      rrIntervals: response['rr_intervals']['rr_intervals'],
      rrIntervalsAvarage: response['rr_intervals']['rr_intervals_average'],
      rrIntervalsIntervals: response['rr_intervals']['rr_intervals_intervals'],
    },
    intervalsDensityData: {
      binCenters: response['intervals_density_data']['bin_centers'],
      counts: response['intervals_density_data']['counts'],
    },
  };
  console.log(res);
  return res;
}