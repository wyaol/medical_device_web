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
      data: data['qCON'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'qNOX（伤害刺激指数）',
      data: data['qNOX'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'BS（爆发抑制比）',
      data: data['BS'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'EMG（肌电指数）',
      data: data['EMG'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'SQI（信号质量）',
      data: data['SQI'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'FREQ（EEG 频率）',
      data: data['FREQ'],
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
      data: data['SpO2'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'PR（脉率）',
      data: data['PR'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'PI（灌注指数）',
      data: data['PI'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'RR（呼吸频率）',
      data: data['RR'],
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
      data: data,
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
    eegParamsChartRef?.current?.getEchartsInstance().setOption(renderEEGParamsOption(globalState.BrainWaves.eegParamsData, len));
  }, [globalState.BrainWaves.eegParamsData])
  useEffect(() => {
    // @ts-ignore
    eegLeftWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.BrainWaves.eegLeftWavesData));
  }, [globalState.BrainWaves.eegLeftWavesData])
  useEffect(() => {
    // @ts-ignore
    eegRightWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.BrainWaves.eegRightWavesData));
  }, [globalState.BrainWaves.eegRightWavesData])
  useEffect(() => {
    // @ts-ignore
    ppgParamsChartRef?.current?.getEchartsInstance().setOption(renderPPGParamsOption(globalState.BrainWaves.ppgParamsData, len));
  }, [globalState.BrainWaves.ppgParamsData])

  useEffect(() => {
    // @ts-ignore
    ppgLeftWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.BrainWaves.ppgLeftWavesData));
  }, [globalState.BrainWaves.ppgLeftWavesData]);

  useEffect(() => {
    // @ts-ignore
    ppgRightWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.BrainWaves.ppgRightWavesData));
  }, [globalState.BrainWaves.ppgRightWavesData]);

  return (<div>

    <Flex vertical={false}>
      <ReactEcharts
        notMerge={true}
        ref={eegParamsChartRef}
        option={renderEEGParamsOption(globalState.BrainWaves.eegParamsData, 20)}
        style={{height: '440px', width: '40%'}}
      />

      <Flex style={{height: '440px', width: '60%'}} vertical={true}>
        <ReactEcharts
          notMerge={true}
          ref={eegLeftWavesChartRef}
          option={renderWavesOption(globalState.BrainWaves.eegLeftWavesData, 1024, 'EEG waves - left')}
          style={{height: '220px', width: '100%'}}
        />
        <ReactEcharts
          notMerge={true}
          ref={eegRightWavesChartRef}
          option={renderWavesOption(globalState.BrainWaves.eegRightWavesData, 1024, 'EEG waves - right')}
          style={{height: '220px', width: '100%'}}
        />
      </Flex>
    </Flex>
    <Flex vertical={false}>
      <ReactEcharts
        notMerge={true}
        ref={ppgParamsChartRef}
        option={renderPPGParamsOption(globalState.BrainWaves.ppgParamsData, 20)}
        style={{height: '440px', width: '40%'}}
      />

      <Flex style={{height: '440px', width: '60%'}} vertical={true}>
        <ReactEcharts
          notMerge={true}
          ref={ppgLeftWavesChartRef}
          option={renderWavesOption(globalState.BrainWaves.ppgLeftWavesData, 1024, 'PPG waves - left')}
          style={{height: '220px', width: '100%'}}
        />
        <ReactEcharts
          notMerge={true}
          ref={ppgRightWavesChartRef}
          option={renderWavesOption(globalState.BrainWaves.ppgRightWavesData, 1024, 'PPG waves - right')}
          style={{height: '220px', width: '100%'}}
        />
      </Flex>
    </Flex>

  </div>)
}

export default BrainWavesRealTimeData
