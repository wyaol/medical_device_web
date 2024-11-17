import ReactEcharts from "echarts-for-react";
import {useEffect, useRef} from 'react';
import {useGlobalState} from '../../config/GlobalStateContext';
import {Flex} from "antd";

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

const renderEEGParamsOption = (data: any, len: number) => ({
  xAxis: {
    show: false,
    type: 'category',
    data: categories(len),
  },
  yAxis: {
    type: 'value'
  },
  legend: [
    {
      data: ['qCON（镇静指数）', 'qNOX（伤害刺激指数）', 'BS（爆发抑制比）'],
      top: 'top',
      orient: 'horizontal',
      itemGap: 10, // 调整图例项之间的间距
      itemWidth: 20, // 调整图例项的宽度
    },
    {
      data: ['EMG（肌电指数）', 'SQI（信号质量）', 'FREQ（EEG 频率）'],
      top: '15',
      orient: 'horizontal',
      itemGap: 10, // 调整图例项之间的间距
      itemWidth: 20, // 调整图例项的宽度
    }
  ],
  series: [
    {
      name: 'qCON（镇静指数）',
      data: data['blood_pressure_diastolic'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'qNOX（伤害刺激指数）',
      data: data['blood_pressure_systolic'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'BS（爆发抑制比）',
      data: data['heart_rate'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'EMG（肌电指数）',
      data: data['microcirculation'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'SQI（信号质量）',
      data: data['oxygen_saturation'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'FREQ（EEG 频率）',
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
      dataView: {readOnly: false},
      restore: {},
      saveAsImage: {}
    }
  },
})
const renderPPGParamsOption = (data: any, len: number) => ({
  xAxis: {
    show: false,
    type: 'category',
    data: categories(len),
  },
  yAxis: {
    type: 'value'
  },
  legend: {
    itemGap: 10,
    itemWidth: 20,
    data: ['SpO2（血氧饱和度）', 'PR（脉率）', 'PI（灌注指数）', 'RR（呼吸频率）']
  },
  series: [
    {
      name: 'SpO2（血氧饱和度）',
      data: data['blood_pressure_diastolic'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'PR（脉率）',
      data: data['blood_pressure_systolic'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'PI（灌注指数）',
      data: data['heart_rate'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'RR（呼吸频率）',
      data: data['microcirculation'],
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
      dataView: {readOnly: false},
      restore: {},
      saveAsImage: {}
    }
  },
})

const renderWavesOption = (data: any, len: number, name: string) => ({
  title: {
    text: name, // 标题文本
    left: 'center', // 标题位置，可以是 'left', 'center', 'right' 或具体的像素值
    top: 'top', // 标题位置，可以是 'top', 'middle', 'bottom' 或具体的像素值
    textStyle: {
      fontSize: 18, // 标题字体大小
      color: '#333' // 标题颜色
    }
  },
  xAxis: {
    show: false,
    type: 'category',
    data: categories(len),
  },
  yAxis: {
    type: 'value',
    max: 475,
    min: -475,
  },
  series: [
    {
      name: name,
      data: data.eegWaves,
      type: 'line',
      showSymbol: false,
      smooth: true,
      color: 'blue'
    }
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
      dataView: {readOnly: false},
      restore: {},
      saveAsImage: {}
    }
  },
})
const BrainWavesRealTimeData = () => {
  const {globalState} = useGlobalState();
  const eegParamsChartRef = useRef(null);
  const eegLeftWavesChartRef = useRef(null);
  const eegRightWavesChartRef = useRef(null);
  const ppgParamsChartRef = useRef(null);
  const ppgLeftWavesChartRef = useRef(null);
  const ppgRightWavesChartRef = useRef(null);


  const len = 20;

  useEffect(() => {
    // @ts-ignore
    eegParamsChartRef?.current?.getEchartsInstance().setOption(renderEEGParamsOption(globalState.plusWave.data, len));
  }, [globalState.plusWave.data])
  useEffect(() => {
    // @ts-ignore
    eegLeftWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.plusWave.data));
  }, [globalState.plusWave.data])
  useEffect(() => {
    // @ts-ignore
    eegRightWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.plusWave.data));
  }, [globalState.plusWave.data])
  useEffect(() => {
    // @ts-ignore
    ppgParamsChartRef?.current?.getEchartsInstance().setOption(renderPPGParamsOption(globalState.plusWave.data, len));
  }, [globalState.plusWave.data])

  useEffect(() => {
    // @ts-ignore
    ppgLeftWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.plusWave.data));
  }, [globalState.plusWave.data]);

  useEffect(() => {
    // @ts-ignore
    ppgRightWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.plusWave.data));
  }, [globalState.plusWave.data]);

  return (<div>

    <Flex vertical={false}>
      <ReactEcharts
        notMerge={true}
        ref={eegParamsChartRef}
        option={renderEEGParamsOption(globalState.plusWave.data, 20)}
        style={{height: '440px', width: '40%'}}
      />

      <Flex style={{height: '440px', width: '60%'}} vertical={true}>
        <ReactEcharts
          notMerge={true}
          ref={eegLeftWavesChartRef}
          option={renderWavesOption(globalState.plusWave.data, 400, 'EEG waves - left')}
          style={{height: '220px', width: '100%'}}
        />
        <ReactEcharts
          notMerge={true}
          ref={eegRightWavesChartRef}
          option={renderWavesOption(globalState.plusWave.data, 400, 'EEG waves - right')}
          style={{height: '220px', width: '100%'}}
        />
      </Flex>
    </Flex>
    <Flex vertical={false}>
      <ReactEcharts
        notMerge={true}
        ref={ppgParamsChartRef}
        option={renderPPGParamsOption(globalState.plusWave.data, 20)}
        style={{height: '440px', width: '40%'}}
      />

      <Flex style={{height: '440px', width: '60%'}} vertical={true}>
        <ReactEcharts
          notMerge={true}
          ref={ppgLeftWavesChartRef}
          option={renderWavesOption(globalState.plusWave.data, 400, 'PPG waves - left')}
          style={{height: '220px', width: '100%'}}
        />
        <ReactEcharts
          notMerge={true}
          ref={ppgRightWavesChartRef}
          option={renderWavesOption(globalState.plusWave.data, 400, 'PPG waves - right')}
          style={{height: '220px', width: '100%'}}
        />
      </Flex>
    </Flex>

  </div>)
}

export default BrainWavesRealTimeData
