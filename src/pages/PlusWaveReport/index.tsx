import { Button, message, Select } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { getAllDataCollectionPeriods, getRRIntervals, getTimeDomainMetrics } from '../../service/plusWaveService';
import './index.css';
import PlusWaveMetrics from '../../components/PlusWaveMetrics';
import RRIntervals from '../../components/RRIntervals';
import HeartRateVariabilityTimeDomainMetrics from '../../components/HeartRateVariabilityTimeDomainMetrics';
import IntervalsDensity from '../../components/IntervalsDensity';

const PlusWaveReport = () => {
  const [dataCollectionPeriods, setDataCollectionPeriods] = useState([]);
  const [periodId, setPeriodId] = useState<number | null>(null);
  const [periodIdToGenReport, setPeriodIdToGenReport] = useState<number | null>(null);
  const [intervalsDensityData, setIntervalsDensityData] = useState<[]>([])
  const [rrIntervals, setRrIntervals] = useState<{
    rrIntervals: number[],
    rrIntervalsAvarage: number[],
    rrIntervalsIntervals: number[],
    intervalsDensityData: any
  }>({
    rrIntervals: [],
    rrIntervalsAvarage: [],
    rrIntervalsIntervals: [],
    intervalsDensityData: {}
  });
  const [heartRateVariabilityTimeDomainMetrics, setHeartRateVariabilityTimeDomainMetrics] = useState<any>({})

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

    getRRIntervals(periodId)
      .then(rrIntervals => {
        setRrIntervals(rrIntervals);
        setIntervalsDensityData(rrIntervals.intervalsDensityData);
      })
      .catch((error: Error) => {
        message.error('生成报告失败: ' + error.message);
      });

    getTimeDomainMetrics(periodId).then((timeDomainMetrics) => {
      setHeartRateVariabilityTimeDomainMetrics(timeDomainMetrics)
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
        <div className="report-box">
          <div className="report-title">心跳间隔</div>
          <div className="report-results">
            {rrIntervals.rrIntervals.length > 0 ? (
              rrIntervals.rrIntervals.slice(0, 500).map((rrInterval, index) => (
                <div key={index} className="interval-item">
                  {Math.round(rrInterval)}
                </div>
              ))
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </div>
        <div className="report-box intervals-container">
          <div>
            <RRIntervals title='心跳间期' data={rrIntervals.rrIntervals} max={1400} min={0} />
          </div>
          <div>
            <RRIntervals title={'心跳间期（平均值）'} data={rrIntervals.rrIntervalsAvarage} max={500} min={-500} />
          </div>
          <div>
            <RRIntervals title={'心跳间期（差值）'} data={rrIntervals.rrIntervalsIntervals} max={500} min={-500} />
          </div>
        </div>

        <div className="report-box">
          <IntervalsDensity data={intervalsDensityData}/>
        </div>

        <div>
          <HeartRateVariabilityTimeDomainMetrics heartRateVariabilityTimeDomainMetrics={heartRateVariabilityTimeDomainMetrics}/>
        </div>

        <div className="report-box">
          <PlusWaveMetrics periodId={periodId} />
        </div>

      </div>}
    </div>
  );
};

export default PlusWaveReport;
