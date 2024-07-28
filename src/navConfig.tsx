// src/navConfig.ts
import {LineChartOutlined, BarChartOutlined, SettingOutlined} from '@ant-design/icons';
import PlusWaveRealTimeData from "./pages/PlusWaveRealTimeData";
import HeartRateRealTimeData from "./pages/HeartRateRealTimeData";
import DeviceManagement from "./pages/DeviceManagement";

export interface NavItem {
  key: string;
  path: string;
  name: string;
  icon?: React.ReactNode;
  element?: React.ReactElement;
  children?: NavItem[];
}

const navConfig: NavItem[] = [
  {
    key: '1',
    path: '/real-time-data',
    name: '实时监控',
    icon: <LineChartOutlined />,
    children: [
      {
        key: '1-1',
        path: '/real-time-data/plus-wave',
        name: '脉搏波',
        element: <PlusWaveRealTimeData/>,
      },
      {
        key: '1-2',
        path: '/real-time-data/heart-rate',
        name: '心率',
        element: <HeartRateRealTimeData/>,
      },
    ],
  },
    {
    key: '2',
    path: '/analyse-report',
    name: '分析报告',
    icon: <BarChartOutlined />,
    children: [],
  },
    {
    key: '3',
    path: '/device-management',
    name: '设备管理',
    icon: <SettingOutlined />,
    element: <DeviceManagement/>,
  },
];

export default navConfig;
