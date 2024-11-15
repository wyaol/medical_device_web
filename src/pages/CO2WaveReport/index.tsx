import {Button, message, Select} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import {getAllDataCollectionPeriods,} from '../../service/co2DataService';
import './index.css';
import IntervalAnalyseComponent from "../../components/IntervalsAnalyseComponent";
import {IntervalAnalyse} from "../../types";
import {getIntervalAnalyseByType} from "../../service/intervalAnalyseService";


const INTERVAL_TYPE = [
  {
    label: '呼吸',
    value: 'co2_breath'
  },
  {
    label: '吸',
    value: 'co2_inspiratory'
  },
  {
    label: '呼',
    value: 'co2_expiratory'
  }
]


const CO2WaveReport = () => {
  const [dataCollectionPeriods, setDataCollectionPeriods] = useState([]);
  const [periodId, setPeriodId] = useState<number | null>(null);
  const [intervalType, setIntervalType] = useState<string>(INTERVAL_TYPE[0].value);
  const [periodIdToGenReport, setPeriodIdToGenReport] = useState<number | null>(null);
  const [intervalAnalyse, setIntervalAnalyse] = useState<IntervalAnalyse | null>(null);
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

    setPeriodIdToGenReport(periodId);

    getIntervalAnalyseByType(periodId, intervalType).then((res) => {
      setIntervalAnalyse(res);
    });
  }, [periodId, intervalType]);

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
      <div className="select-container">
        <label>选择分析类型: </label>
        <Select
          className="select-dropdown"
          onChange={(value) => setIntervalType(value)}
          options={INTERVAL_TYPE.map(item => ({
            value: item.value,
            label: item.label
          }))}
          placeholder="选择分析类型"
        />
      </div>
      <Button type="primary" onClick={genReport} className="generate-report-button">
        生成报告
      </Button>
      {periodIdToGenReport && <div>

        {intervalAnalyse && <IntervalAnalyseComponent intervalAnalyse={intervalAnalyse}/>}

      </div>}
    </div>
  );
};

export default CO2WaveReport;
