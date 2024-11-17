import PlusWaveRealTimeData from "./pages/PlusWaveRealTimeData";
import HeartRateRealTimeData from "./pages/HeartRateRealTimeData";
import DeviceManagement from "./pages/DeviceManagement";
import PlusWaveReport from './pages/PlusWaveReport';
import PatientCreate from './pages/PatientCreate';
import PatientSelect from './pages/PatientSelect';
import CO2WaveformRealData from './pages/CO2WaveformRealData';
import CO2DataRecord from './pages/CO2DataRecord';
import CO2WaveReport from './pages/CO2WaveReport';
import BrainWavesRealTimeData from './pages/BrainWavesRealTimeData'


const routeConfig = [
  {
    path: '/real-time-data/plus-wave',
    element: <PlusWaveRealTimeData />,
  },
  {
    path: '/real-time-data/heart-rate',
    element: <HeartRateRealTimeData />,
  },
  {
    path: '/real-time-data/co2-waveform',
    element: <CO2WaveformRealData />,
  },
  {
    path: '/real-time-data/brain-waves',
    element: <BrainWavesRealTimeData />,
  },
  {
    path: '/analyse-report/plus-wave',
    element: <PlusWaveReport />,
  },
  {
    path: '/analyse-report/co2-serial',
    element: <CO2WaveReport />,
  },
  {
    path: '/record-player/co2-serial',
    element: <CO2DataRecord />,
  },
  {
    path: '/patient-management/create',
    element: <PatientCreate />,
  },
  {
    path: '/patient-management/select',
    element: <PatientSelect />,
  },
  {
    path: '/device-management',
    element: <DeviceManagement />,
  },
];

export default routeConfig