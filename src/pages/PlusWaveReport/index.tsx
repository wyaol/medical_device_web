import {Button, message, Select} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import {
  getAllDataCollectionPeriods,
  getFrequencyDomainMetrics,
  getIntervalAnalyse,
  getTimeDomainMetrics
} from '../../service/plusWaveService';
import './index.css';
import PlusWaveMetrics from '../../components/PlusWaveMetrics';
import HeartRateVariabilityTimeDomainMetrics from '../../components/HeartRateVariabilityTimeDomainMetrics';
import HeartRateVariabilityFrequencyDomainMetrics from '../../components/HeartRateVariabilityFrequencyDomainMetrics';
import IntervalAnalyseComponent from "../../components/IntervalsAnalyseComponent";
import {IntervalAnalyse} from "../../types";

const PlusWaveReport = () => {
  const [dataCollectionPeriods, setDataCollectionPeriods] = useState([]);
  const [intervalAnalyse, setIntervalAnalyse] = useState<IntervalAnalyse>({
    frequencies: [],
    intervalScatterDistributedPlotData: {x_data: [], y_data: [], board: 0},
    intervalScatterPlotData: {angle: 0, symmetry_point1: [], symmetry_point2: [], x_data: [], y_data: [], board: 0},
    intervalsDensityData: {binCenters: [], counts: []},
    normalizedPsd: [],
    psdHistogramData: [],
    rrIntervals: {rrIntervals: [], rrIntervalsAvarage: [], rrIntervalsIntervals: []}
  });
  const [periodId, setPeriodId] = useState<number | null>(null);
  const [periodIdToGenReport, setPeriodIdToGenReport] = useState<number | null>(null);
  const [heartRateVariabilityTimeDomainMetrics, setHeartRateVariabilityTimeDomainMetrics] = useState<{
    avg: number, sd: number, cv: number, max: number, min: number, ld: number,
    fm: number, pm: number, dm: number, sc: number, ic: number, ac: number,
    xgd: number, ygd: number, mrd: number, syd: number
  }>({
    avg: 0, sd: 0, cv: 0, max: 0, min: 0, ld: 0,
    fm: 0, pm: 0, dm: 0, sc: 0, ic: 0, ac: 0,
    xgd: 0, ygd: 0, mrd: 0, syd: 0
  })
  const [heartRateVariabilityFrequencyDomainMetrics, setHeartRateVariabilityFrequencyDomainMetrics] = useState<any>({})

  useEffect(() => {
    getAllDataCollectionPeriods()
      .then(periods => {
        setDataCollectionPeriods(periods);
      })
      .catch((error: Error) => {
        message.error('获取采集时间段失败: ' + error.message);
      });
  }, []);

  const genReport = useCallback(() => {
    if (periodId === null) {
      message.warning('请先选择一个采集时间段');
      return;
    }

    getIntervalAnalyse(periodId).then((res) => {
      setIntervalAnalyse(res)
    })

    getTimeDomainMetrics(periodId).then((timeDomainMetrics) => {
      setHeartRateVariabilityTimeDomainMetrics(timeDomainMetrics)
    })


    getFrequencyDomainMetrics(periodId).then((frequencyDomainMetrics) => {
      setHeartRateVariabilityFrequencyDomainMetrics(frequencyDomainMetrics)
    })

    setPeriodIdToGenReport(periodId);
  }, [periodId]);

  return (
    <div className="plus-wave-report-container">
      <div className="select-container">
        <label>选择采集时间段: </label>
        <Select
          className="select-dropdown"
          onChange={(value) => setPeriodId(value)}
          options={dataCollectionPeriods.map(item => ({
            value: item['id'],
            label: `${item['start_time']} - ${item['end_time']}`
          }))}
          placeholder="请选择时间段"
        />
      </div>
      <Button type="primary" onClick={genReport} className="generate-report-button">
        生成报告
      </Button>
      {periodIdToGenReport && <div>

        <IntervalAnalyseComponent intervalAnalyse={intervalAnalyse}/>

        <div style={{marginTop: '30px'}}>
          <HeartRateVariabilityTimeDomainMetrics
              heartRateVariabilityTimeDomainMetrics={heartRateVariabilityTimeDomainMetrics}/>
          <HeartRateVariabilityFrequencyDomainMetrics
              heartRateVariabilityFrequencyDomainMetrics={heartRateVariabilityFrequencyDomainMetrics}/>
        </div>

        <div className="report-box">
          <PlusWaveMetrics periodId={periodId}/>
        </div>

      </div>}
    </div>
  );
};

export default PlusWaveReport;
