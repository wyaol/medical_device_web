import { Button, message, Select } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { getAllDataCollectionPeriods, getRRIntervals } from '../../service/plusWaveService';
import './index.css';
import PlusWaveMetrics from '../../components/PlusWaveMetrics';

const PlusWaveReport = () => {
  const [dataCollectionPeriods, setDataCollectionPeriods] = useState([]);
  const [periodId, setPeriodId] = useState<number | null>(null);
  const [periodIdToGenReport, setPeriodIdToGenReport] = useState<number | null>(null);
  const [rrIntervals, setRrIntervals] = useState<number[]>([]);

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
      })
      .catch((error: Error) => {
        message.error('生成报告失败: ' + error.message);
      });

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
            {rrIntervals.length > 0 ? (
              rrIntervals.map((rrInterval, index) => (
                <div key={index} className="interval-item">
                  {Math.round(rrInterval)}
                </div>
              ))
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </div>
        <div className="report-box">
          <PlusWaveMetrics periodId={periodId} />
        </div>
      </div>}
    </div>
  );
};

export default PlusWaveReport;
