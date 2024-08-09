import ReactEcharts from "echarts-for-react";
import { useEffect, useRef } from 'react';
import { useGlobalState } from '../../config/GlobalStateContext';


const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

const categories = (len: number): string[] => {
  let res: string[] = [];
  while (len--) {
    res.push(generateRandomString(10));
  }
  return res;
}

const renderOption = (data: any, len: number) => ({
  xAxis: {
    show: false,
    type: 'category',
    data: categories(len),
  },
  yAxis: {
    type: 'value'
  },
  legend: {
    data: ['血压收缩压', '血压舒张压', '心率', '微循环', '血氧饱和度']
  },
  series: [
    {
      name: '血压收缩压',
      data: data['blood_pressure_diastolic'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: '血压舒张压',
      data: data['blood_pressure_systolic'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: '心率',
      data: data['heart_rate'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: '微循环',
      data: data['microcirculation'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: '血氧饱和度',
      data: data['oxygen_saturation'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#283b56'
      }
    }
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
})

const PlusWaveRealTimeData = () => {
  const { globalState } = useGlobalState();
  const chartRef = useRef(null);

  const len = 20;

  useEffect(() => {
    // @ts-ignore
    chartRef?.current?.getEchartsInstance().setOption(renderOption(globalState.plusWave.data, len));
  }, [globalState.plusWave.data])

  return (<div>
    <ReactEcharts
      notMerge={true}
      ref={chartRef}
      option={renderOption(globalState.plusWave.data, len)}
      style={{ height: '500px', width: '100%' }}
    />
  </div>)
}

export default PlusWaveRealTimeData
