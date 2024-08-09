import { Button, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAllDataCollectionPeriods, getRRIntervals } from '../../service/plusWaveService';

const PlusWaveReport = () => {
  const [dataCollectionPeriods, setDataCollectionPeriods] = useState([])
  const [periodId, setPeriodId] = useState<number | null>(null)
  const [rrIntervals, setRrIntervals] = useState<number[]>([])

  useEffect(() => {
    getAllDataCollectionPeriods().then(periods => {
      setDataCollectionPeriods(periods);
    }).catch((error: Error) => {
      message.error(error.message);
    });
  }, [])

  const genReport = () => {
    getRRIntervals(periodId).then(rrIntervals => {
      setRrIntervals(rrIntervals);
    })
      .catch((error: Error) => {
        message.error(error.message);
      });
  }

  return (<div>
    选择采集时间段<Select onChange={(value) => { setPeriodId(value) }} options={
      dataCollectionPeriods.map(item => ({ value: item['id'], label: <span>{`${item['start_time']}-${item['end_time']}`}</span> }))
    } />
    <Button onClick={genReport}>生成报告</Button>
    {rrIntervals.map(rrInterval => (`${Math.round(rrInterval)} `))}
  </div>)
}

export default PlusWaveReport
