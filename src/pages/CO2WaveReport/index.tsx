import {Button, message, Select} from 'antd';
import React, {useEffect, useState, useCallback} from 'react';
import {
  getAllDataCollectionPeriods,
  getIntervals,
} from '../../service/co2DataService';
import './index.css';

const CO2WaveReport = () => {
  const [dataCollectionPeriods, setDataCollectionPeriods] = useState([]);
  const [periodId, setPeriodId] = useState<number | null>(null);
  const [periodIdToGenReport, setPeriodIdToGenReport] = useState<number | null>(null);
  const [intervals, setIntervals] = useState<{
    breathIntervals: number[],
    inspiratoryIntervals: number[],
    expiratoryIntervals: number[]
  }>({
    breathIntervals: [],
    inspiratoryIntervals: [],
    expiratoryIntervals: []
  });
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

    getIntervals(periodId)
      .then(intervals => {
        setIntervals(intervals);
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
          <div className="report-title">呼吸间隔</div>
          <div className="report-results">
            {intervals.breathIntervals.length > 0 ? (
              intervals.breathIntervals.slice(0, 500).map((breathIntervals, index) => (
                <div key={index} className="interval-item">
                  {breathIntervals}
                </div>
              ))
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </div>
        <div className="report-box">
          <div className="report-title">吸气间隔</div>
          <div className="report-results">
            {intervals.inspiratoryIntervals.length > 0 ? (
              intervals.inspiratoryIntervals.slice(0, 500).map((breathIntervals, index) => (
                <div key={index} className="interval-item">
                  {breathIntervals}
                </div>
              ))
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </div>
        <div className="report-box">
          <div className="report-title">呼气间隔</div>
          <div className="report-results">
            {intervals.expiratoryIntervals.length > 0 ? (
              intervals.expiratoryIntervals.slice(0, 500).map((breathIntervals, index) => (
                <div key={index} className="interval-item">
                  {breathIntervals}
                </div>
              ))
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </div>
      </div>}
    </div>
  );
};

export default CO2WaveReport;
