// src/navConfig.ts
import {LineChartOutlined, BarChartOutlined, SettingOutlined} from '@ant-design/icons';
import PlusWaveRealTimeData from "./pages/PlusWaveRealTimeData";
import HeartRateRealTimeData from "./pages/HeartRateRealTimeData";
import DeviceManagement from "./pages/DeviceManagement";
import PlusWaveReport from './pages/PlusWaveReport';
import PatientCreate from './pages/PatientCreate';
import PatientSelect from './pages/PatientSelect';
import CO2WaveformRealData from './pages/Co2WaveformRealTimeData';

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
        element: <PlusWaveRealTimeData />,
      },
      {
        key: '1-2',
        path: '/real-time-data/heart-rate',
        name: '心率',
        element: <HeartRateRealTimeData />,
      },
      {
        key: '1-3',
        path: '/real-time-data/co2-waveform',
        name: 'CO2',
        element: <CO2WaveformRealData/>,
      }
    ],
  },
  {
    key: '2',
    path: '/analyse-report',
    name: '分析报告',
    icon: <BarChartOutlined />,
    children: [
      {
        key: '2-1',
        path: '/analyse-report/plus-wave',
        name: '脉搏波',
        element: <PlusWaveReport />,
      },
    ],
  },
  {
    key: '3',
    path: '/patient-management',
    name: '病人管理',
    icon: <UserOutlined />,
    children: [
      {
        key: '3-1',
        path: '/patient-management/create',
        name: '创建病人',
        element: <PatientCreate />,
      },
      {
        key: '3-2',
        path: '/patient-management/select',
        name: '绑定病人',
        element: <PatientSelect />,
      },
    ],
  },
  {
    key: '4',
    path: '/device-management',
    name: '设备管理',
    icon: <SettingOutlined />,
    element: <DeviceManagement />,
  },
];

export default navConfig;
