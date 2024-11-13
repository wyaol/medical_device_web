// src/navConfig.ts
import {BarChartOutlined, LineChartOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import React from "react";
import {Link} from "react-router-dom";
import {MenuProps} from "antd";


type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '1',
    icon: <LineChartOutlined/>,
    label: '实时监控',
    children: [
      {key: '1-1', label: <Link to="/real-time-data/plus-wave">脉搏波</Link>},
      {key: '1-2', label: <Link to="/real-time-data/heart-rate">心率</Link>},
      {key: '1-3', label: <Link to="/real-time-data/co2-waveform">CO2</Link>},
    ],
  },
  {
    key: '2',
    icon: <BarChartOutlined/>,
    label: '分析报告',
    children: [
      {
        key: '2-1', label: '脉搏波', children: [
          {key: '2-1-1', label: <Link to="/analyse-report/plus-wave">变异率分析</Link>}
        ]
      },
      {
        key: '2-2', label: 'CO2', children: [
          {key: '2-2-1', label: <Link to="/analyse-report/co2-serial">变异率分析</Link>}
        ]
      },
    ],
  },
  {
    key: '3',
    icon: <BarChartOutlined/>,
    label: '回放记录',
    children: [
      {key: '3-1', label: <Link to="/record-player/co2-serial">CO2记录回放</Link>}
    ]
  },
  {
    key: '4',
    icon: <UserOutlined/>,
    label: '病人管理',
    children: [
      {key: '4-1', label: <Link to="/patient-management/create">创建病人</Link>},
      {key: '4-2', label: <Link to="/patient-management/select">选择病人</Link>}
    ]
  },
  {
    key: '5',
    icon: <SettingOutlined/>,
    label: <Link to="/device-management">设备管理</Link>
  }
];

export default items;
