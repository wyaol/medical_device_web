import React, { useEffect, useRef } from "react";
import ReactEcharts from "echarts-for-react";


const renderOption = (title: string, data: any, maxValue: number, minValue: number) => ({
  title: {
    text: title
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
    max: maxValue,
    min: minValue,
    interval: 200
  },
  series: [
    {
      name: 'RR间期',
      data: data,
      type: 'line',
      showSymbol: false,
      lineStyle: {
        width: 1 // 设置折线的粗细（宽度）
      },
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
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  }
})


const RRIntervals: React.FC<{
  title: string,
  data: number[],
  max: number,
  min: number
}> = (props: {
  title: string,
  data: number[],
  max: number,
  min: number
}) => {

    const ref = useRef(null);
    const title = props.title

    useEffect(() => {
      // @ts-ignore
      ref?.current?.getEchartsInstance().setOption(renderOption(title, props.data, props.max, props.min));
    }, [props.data]);

    return (
      <ReactEcharts
        notMerge={true}
        ref={ref}
        option={renderOption(title, [], props.max, props.min)}
        style={{ width: '100%' }}
      />
    );
  }

export default RRIntervals;
