import ReactEcharts from "echarts-for-react";
import {useEffect, useRef, useState} from 'react';
import {useGlobalState} from '../../config/GlobalStateContext';
import {Flex, Button, message, Modal, List, Tag} from "antd";
import {AxiosResponse} from 'axios';
import storage from '../../storage';
import {
  scanBrainWavesDevice,
  connectBrainWavesDevice,
  disconnectBrainWavesDevice,
  startDataCollector,
  stopDataCollector
} from '../../service/brainWavesService';
import {startRecord, compressEvents, getRecordMinioObjectName, generateRandomString, categories} from '../../utils'
import {putObjectByPresignedUrl} from '../../service/objectStoreService'

const EventMarkMap: React.FC<{ data: { IC: number, DT: number, DV: number } }> = ({data}) => {
  return (
    <Flex gap="0 10px" justify={'center'}>
      <Flex vertical={true}>
        <Tag color="#2db7f5" style={{
          height: '40%', display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>{data.IC.toFixed(0)}</Tag>
        <Tag color="#2db7f5" style={{height: '30%'}}>事件类型（IC）</Tag>
      </Flex>
      <Flex vertical={true}>
        <Tag color="#87d068" style={{
          height: '40%', display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>{data.DT.toFixed(0)}</Tag>
        <Tag color="#87d068" style={{height: '30%'}}>药物类型（DT）</Tag>
      </Flex>
      <Flex vertical={true}>
        <Tag color="#108ee9" style={{
          height: '40%', display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>{data.DV.toFixed(3)}</Tag>
        <Tag color="#108ee9" style={{height: '30%'}}>药物用量（DV）</Tag>
      </Flex>
    </Flex>
  );
};
const renderEEGParamsOption = (data: any, len: number) => ({
  grid: {
    bottom: '5%', // 下边距
  },
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
      itemGap: 10, // 增加图例项之间的间距
      itemWidth: 20, // 增加图例项的宽度
      textStyle: {
        fontSize: 10, // 调整字体大小
        padding: [0, 10], // 增加左右内边距
        width: 100, // 设置文本的固定宽度
        overflow: 'ellipsis', // 超出部分用省略号表示
      },
    },
    {
      data: ['EMG（肌电指数）', 'SQI（信号质量）', 'FREQ（EEG 频率）'],
      top: '15',
      orient: 'horizontal',
      itemGap: 10, // 增加图例项之间的间距
      itemWidth: 20, // 增加图例项的宽度
      textStyle: {
        fontSize: 10, // 调整字体大小
        padding: [0, 10], // 增加左右内边距
        width: 100, // 设置文本的固定宽度
        overflow: 'ellipsis', // 超出部分用省略号表示
      },
    },
    {
      data: ['PImp（电极的皮肤阻抗）', 'RImp（电极的皮肤阻抗）', 'NImp（电极的皮肤阻抗）'],
      top: '30',
      orient: 'horizontal',
      itemGap: 10, // 增加图例项之间的间距
      itemWidth: 20, // 增加图例项的宽度
      textStyle: {
        fontSize: 10, // 调整字体大小
        padding: [0, 10], // 增加左右内边距
        width: 100, // 设置文本的固定宽度
        overflow: 'ellipsis', // 超出部分用省略号表示
      },
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
    {
      name: 'PImp（电极的皮肤阻抗）',
      data: data['PImp'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'RImp（电极的皮肤阻抗）',
      data: data['RImp'],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
    {
      name: 'NImp（电极的皮肤阻抗）',
      data: data['NImp'],
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
    show: false,
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
    show: false,
    feature: {
      dataView: {readOnly: false},
      restore: {},
      saveAsImage: {}
    }
  },
})

const renderWavesOption = (data: any, len: number) => ({
  grid: {
    top: '8%',   // 上边距
    bottom: '5%', // 下边距
    left: '5%',   // 左边距
    right: '12%'   // 右边距
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
    show: false,
    feature: {
      dataView: {readOnly: false},
      restore: {},
      saveAsImage: {}
    }
  },
  animation: false, // 禁用了图表的所有动画效果。
  animationDuration: 0, // 设置了动画的持续时间为 0 毫秒，即使启用了动画，也不会有任何动画效果
  animationEasing: 'cubicInOut'
})
const BrainWavesRealTimeData = () => {
  const {globalState, setGlobalState} = useGlobalState();
  const eegLeftParamsChartRef = useRef(null);
  const eegRightParamsChartRef = useRef(null);
  const eegLeftWavesChartRef = useRef(null);
  const eegRightWavesChartRef = useRef(null);
  const ppgParamsChartRef = useRef(null);
  const ppgLeftWavesChartRef = useRef(null);
  const recordingRef = useRef<any>(null);
  const eventsRef = useRef<any[]>([]);
  const elementsRef = useRef<NodeListOf<HTMLElement>>(document.querySelectorAll('.rr-block') as NodeListOf<HTMLElement>);
  const contextMenuListenerRef = useRef<(e: MouseEvent) => void>();
  const [modelVisible, setModelVisible] = useState<boolean>(false);
  const [indicators, setIndicators] = useState<{ IC: number; DT: number; DV: number; }>({IC: 0, DT: 0, DV: 0});
  const [collectStatus, setCollectStatus] = useState<boolean>(false);
  const [devices, setDevices] = useState<Record<string, string>[]>([]);
  const [scanLoading, setScanLoading] = useState<boolean>(false);
  const [connectLoading, setConnectLoading] = useState<boolean>(false);
  const [connectedDevicePort, setConnectedDevicePort] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    const startTime = new Date();
    await startDataCollector(storage.deviceId)
      .then(() => {
        setGlobalState({
          ...globalState,
          co2WaveformData: {
            ...globalState.co2WaveformData,
            recordDuration: {
              ...globalState.co2WaveformData.recordDuration,
              startTime: startTime,
              endTime: null
            }
          }
        })
        // 隐藏不必要的元素
        elementsRef.current.forEach(element => {
          element.style.display = 'none';
        });
        // 开始录制
        recordingRef.current = startRecord(eventsRef.current);
      })
      .catch((error: Error) => {
        message.error(error.message);
      })
  }
  const stop = async () => {
    const endTime = new Date();
    const startTime = globalState.co2WaveformData.recordDuration.startTime;
    const fileName = getRecordMinioObjectName(startTime, endTime);

    // 停止录制
    if (recordingRef.current) {
      recordingRef.current();
    }
    // 复原元素
    elementsRef.current.forEach(element => {
      element.style.display = 'block';
    });
    const presignedUrl = await stopDataCollector(storage.deviceId, startTime, endTime, fileName)
    setGlobalState({
      ...globalState,
      co2WaveformData: {
        ...globalState.co2WaveformData,
        recordDuration: {
          ...globalState.co2WaveformData.recordDuration,
          startTime: null,
          endTime: null,
        }
      }
    })
    const data = compressEvents(eventsRef.current)
    if (data) {
      await putObjectByPresignedUrl(presignedUrl, fileName, data);
    }
  }

  const len = 20;

  useEffect(() => {
    setIndicators({
      IC: globalState.brainWavesData.eventMarkData['IC'],
      DT: globalState.brainWavesData.eventMarkData['DT'],
      DV: globalState.brainWavesData.eventMarkData['DV']
    })
  }, [globalState.brainWavesData.eventMarkData])
  useEffect(() => {
    // @ts-ignore
    eegLeftParamsChartRef?.current?.getEchartsInstance().setOption(renderEEGParamsOption(globalState.brainWavesData.eegLeftParamsData, len));
  }, [globalState.brainWavesData.eegLeftParamsData])
  useEffect(() => {
    // @ts-ignore
    eegRightParamsChartRef?.current?.getEchartsInstance().setOption(renderEEGParamsOption(globalState.brainWavesData.eegRightParamsData, len));
  }, [globalState.brainWavesData.eegRightParamsData])
  useEffect(() => {
    // @ts-ignore
    eegLeftWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.brainWavesData.eegLeftWavesData));
  }, [globalState.brainWavesData.eegLeftWavesData])
  useEffect(() => {
    // @ts-ignore
    eegRightWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.brainWavesData.eegRightWavesData));
  }, [globalState.brainWavesData.eegRightWavesData])
  useEffect(() => {
    // @ts-ignore
    ppgParamsChartRef?.current?.getEchartsInstance().setOption(renderPPGParamsOption(globalState.brainWavesData.ppgParamsData, len));
  }, [globalState.brainWavesData.ppgParamsData])

  useEffect(() => {
    // @ts-ignore
    ppgLeftWavesChartRef?.current?.getEchartsInstance().setOption(renderWavesOption(globalState.brainWavesData.ppgWavesData));
  }, [globalState.brainWavesData.ppgWavesData]);


  useEffect(() => {
    if (globalState.brainWavesData.recordDuration.startTime !== null) {
      setCollectStatus(true);
    } else {
      setCollectStatus(false);
    }
  }, [globalState.brainWavesData.recordDuration.startTime])

  useEffect(() => {
    setDevices(globalState.BrainWavesDevice.devices);
    setConnectedDevicePort(globalState.BrainWavesDevice.connect.address);
  }, [globalState.BrainWavesDevice.devices, globalState.BrainWavesDevice.connect.address])

  useEffect(() => {
    setDevices(globalState.BrainWavesDevice.devices);
    setScanLoading(false);
  }, [globalState.BrainWavesDevice.devices])

  useEffect(() => {
    if (storage.plusWave.connect.message !== '') {
      alert(globalState.BrainWavesDevice.connect.message)
    }
    setConnectedDevicePort(globalState.BrainWavesDevice.connect.address);
    setConnectLoading(false);
  }, [globalState.BrainWavesDevice.connect])

  useEffect(() => {
    const data = globalState.brainWavesData.eventMarkData
    setIndicators({IC: data['IC'], DT: data['DT'], DV: data['DV']})
  }, [globalState.brainWavesData.eventMarkData])

  useEffect(() => {
    // 在组件挂载时禁用鼠标右键
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // 存储监听器以便在卸载时移除
    contextMenuListenerRef.current = handleContextMenu;

    // 清理函数，在组件卸载时移除事件监听器
    return () => {
      if (contextMenuListenerRef.current) {
        document.removeEventListener('contextmenu', contextMenuListenerRef.current);
      }
    };
  }, []); // 空依赖数组确保此effect仅运行一次

  return (
    <div style={{height: '880px', width: '100%'}}>
      <Flex vertical={false} style={{height: '9%'}} justify={'space-between'}>
        <EventMarkMap data={indicators}></EventMarkMap>
        <Flex>
          <Button
            disabled={collectStatus}
            type="primary"
            onClick={() => setModelVisible(true)}
            style={{marginRight: '50px'}}
          >设备管理</Button>
          <Button
            disabled={collectStatus}
            onClick={() => start()}
          >开始记录</Button>
          <Button
            onClick={() => stop()}
            style={{marginLeft: '20px'}}
          >停止记录</Button>
        </Flex>
        <Modal
          title={(
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>设备管理</div>)}
          width={800}
          style={{top: '20vh'}}
          open={modelVisible}
          onOk={() => {
            setModelVisible(false)
          }}
          onCancel={() => {
            setModelVisible(false)
          }}
        >
          <Flex
            gap="middle"
            vertical={false}
            justify="space-between" // 将内容水平分布
            align="center" // 垂直居中对齐
          >
            <p>可连接脑电波设备列表</p>
            <Button type="primary"
                    style={{marginLeft: '50px'}}
                    loading={scanLoading}
                    onClick={async () => {
                      setScanLoading(true);
                      await scanBrainWavesDevice(storage.deviceId)
                        .then((res: AxiosResponse<any>) => {
                          if (res.status !== 200) {
                            throw new Error('Scan failed');
                          }
                        })
                        .catch((err) => {
                          setScanLoading(false);
                          setError(err.message);
                        });
                    }}
            >设备扫描</Button>
          </Flex>
          <List
            itemLayout="horizontal"
            dataSource={devices}
            renderItem={(item) => (
              <List.Item
                key={item.address}
                actions={[
                  (connectedDevicePort === null || connectedDevicePort === item.address) &&
                  (<Button
                    loading={connectLoading}
                    danger={connectedDevicePort === item.address}
                    onClick={async () => {
                      if (connectedDevicePort === null) {
                        setConnectLoading(true);
                        await connectBrainWavesDevice(storage.deviceId, item.address)
                          .catch((err) => {
                            setError(err.message);
                            setConnectLoading(false);
                          });
                      } else {
                        await disconnectBrainWavesDevice(storage.deviceId)
                          .then((res: AxiosResponse<any>) => {
                            if (res.status !== 200) {
                              throw new Error('Disconnect failed');
                            }
                            setConnectedDevicePort(null)
                          })
                          .catch((err) => {
                            setError(err.message);
                          });
                      }
                    }}
                  >{connectedDevicePort !== null && connectedDevicePort === item.address ? "断开连接" : "连接"}
                  </Button>)
                ]}
              >
                <List.Item.Meta
                  title={`名称：${item.name}`}
                  description={<p>地址：{item.address}</p>}
                />
              </List.Item>
            )}
          />
        </Modal>
      </Flex>
      <Flex vertical={false} style={{height: '27%'}}>
        <Flex style={{height: '100%', width: '60%'}} vertical={true}>
          <span
            style={{
              height: '10%', width: '100%', textAlign: 'center',
              fontSize: '18px', color: '#333', fontWeight: 'bold'
            }}
          >EEG waves - left</span>
          <ReactEcharts
            notMerge={true}
            ref={eegLeftWavesChartRef}
            option={renderWavesOption(globalState.brainWavesData.eegLeftWavesData, 256)}
            style={{height: '90%', width: '100%'}}
          />
        </Flex>
        <ReactEcharts
          notMerge={true}
          ref={eegLeftParamsChartRef}
          option={renderEEGParamsOption(globalState.brainWavesData.eegLeftParamsData, 20)}
          style={{height: '100%', width: '40%'}}
        />
      </Flex>
      <Flex vertical={false} style={{height: '27%'}}>
        <Flex style={{height: '100%', width: '60%'}} vertical={true}>
          <span
            style={{
              height: '10%', width: '100%', textAlign: 'center',
              fontSize: '18px', color: '#333', fontWeight: 'bold'
            }}
          >EEG waves - right</span>
          <ReactEcharts
            notMerge={true}
            ref={eegRightWavesChartRef}
            option={renderWavesOption(globalState.brainWavesData.eegRightWavesData, 256)}
            style={{height: '90%', width: '100%'}}
          />
        </Flex>
        <ReactEcharts
          notMerge={true}
          ref={eegRightParamsChartRef}
          option={renderEEGParamsOption(globalState.brainWavesData.eegRightParamsData, 20)}
          style={{height: '100%', width: '40%'}}
        />

      </Flex>
      <Flex vertical={false} style={{height: '27%'}}>
        <Flex style={{height: '100%', width: '60%'}} vertical={true}>
          <span
            style={{
              height: '10%', width: '100%', textAlign: 'center',
              fontSize: '18px', color: '#333', fontWeight: 'bold'
            }}
          >PPG waves</span>
          <ReactEcharts
            notMerge={true}
            ref={ppgLeftWavesChartRef}
            option={renderWavesOption(globalState.brainWavesData.ppgWavesData, 256)}
            style={{height: '90%', width: '100%'}}
          />
        </Flex>
        <ReactEcharts
          notMerge={true}
          ref={ppgParamsChartRef}
          option={renderPPGParamsOption(globalState.brainWavesData.ppgParamsData, 20)}
          style={{height: '100%', width: '40%'}}
        />
      </Flex>
    </div>)
}

export default BrainWavesRealTimeData
