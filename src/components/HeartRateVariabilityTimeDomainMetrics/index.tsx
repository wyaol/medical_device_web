import React from "react";
import type {TableProps} from 'antd';
import {Table} from "antd";


const columns: TableProps<Record<string, string>>['columns'] = [
  {
    title: '平均数(Avg)',
    dataIndex: 'avg',
    key: 'avg',
  },
  {
    title: '标准差(SD)',
    dataIndex: 'sd',
    key: 'sd',
  },
  {
    title: '变异系数(CV)',
    dataIndex: 'cv',
    key: 'cv',
  },
  {
    title: '最大值(Max)',
    dataIndex: 'max',
    key: 'max',
  },
  {
    title: '最小值(Min)',
    dataIndex: 'min',
    key: 'min',
  },
  {
    title: '极差(LD)',
    dataIndex: 'ld',
    key: 'ld',
  },
  {
    title: '众数频率(FM)',
    dataIndex: 'fm',
    key: 'fm',
  },
  {
    title: '众数概率(PM)',
    dataIndex: 'pm',
    key: 'pm',
  },
  {
    title: '众数偏差(DM)',
    dataIndex: 'dm',
    key: 'dm',
  },
  {
    title: '彗星斜率(SC)',
    dataIndex: 'sc',
    key: 'sc',
  },
  {
    title: '彗星截距(IC)',
    dataIndex: 'ic',
    key: 'ic',
  },
  {
    title: '彗星偏角(AC)',
    dataIndex: 'ac',
    key: 'ac',
  },
  {
    title: '散点重心(XGD)',
    dataIndex: 'xgd',
    key: 'xgd',
  },
  {
    title: '散点重心(YGD)',
    dataIndex: 'ygd',
    key: 'ygd',
  },
  {
    title: '散点散度(MrD)',
    dataIndex: 'mrd',
    key: 'mrd',
  },
  {
    title: '散点齐性(SyD)',
    dataIndex: 'syd',
    key: 'syd',
  },
];
const renderData = (avg: number, sd: number, cv: number, max: number, min: number, ld: number,
                    fm: number, pm: number, dm: number, sc: number, ic: number, ac: number,
                    xgd: number, ygd: number, mrd: number, syd: number ): {}[] => {
  return [
    {
      key: '1',
      avg: avg.toFixed(3), sd: sd.toFixed(3), cv: cv.toFixed(3), max: max.toFixed(3), min: min.toFixed(3), ld: ld.toFixed(3), fm: fm.toFixed(3), pm: pm.toFixed(3),
      dm: dm.toFixed(3), sc: sc.toFixed(3), ic: ic.toFixed(3), ac: ac.toFixed(3), xgd: xgd.toFixed(3), ygd: ygd.toFixed(3), mrd: mrd.toFixed(3), syd: syd.toFixed(3)
    },
  ]
}
const HeartRateVariabilityTimeDomainMetrics: (props: {
  heartRateVariabilityTimeDomainMetrics: {
     avg: number, sd: number, cv: number, max: number, min: number, ld: number,
    fm: number, pm: number, dm: number, sc: number, ic: number, ac: number,
    xgd: number, ygd: number, mrd: number, syd: number
  }
}) => JSX.Element = (props: {
  heartRateVariabilityTimeDomainMetrics: {
    avg: number, sd: number, cv: number, max: number, min: number, ld: number,
    fm: number, pm: number, dm: number, sc: number, ic: number, ac: number,
    xgd: number, ygd: number, mrd: number, syd: number
  }
}) => {

  const {avg, sd, cv, max, min, ld, fm, pm, dm, sc, ic, ac, xgd, ygd, mrd, syd} = props.heartRateVariabilityTimeDomainMetrics

  return (
      <>
        <h1>心跳间期统计学参数-频域特征表</h1>
        <Table columns={columns} dataSource={renderData(avg, sd, cv, max, min, ld, fm, pm, dm, sc, ic, ac, xgd, ygd, mrd, syd)} pagination={false} />
      </>
  )
};
export default HeartRateVariabilityTimeDomainMetrics;