import React, {useEffect, useRef} from "react";
import ReactEcharts from "echarts-for-react";

const renderOption = (binCenters: [], probabilities: []) => ({
  title: {
    text: '心跳间期概率分布图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    min: 0,
    // max: 1.4,
    type: 'category',
    data: binCenters.map((item: number) => item.toFixed(2)),
    name: '心跳间期 (秒)',
    nameLocation: 'middle',
    nameTextStyle: {
      fontWeight: 'bold',
      fontSize: 16,
      padding: 10
    }
  },
  yAxis: {
    max: 0.028,
    type: 'value',
    name: '概率密度',
    nameLocation: 'middle',
    nameTextStyle: {
      fontWeight: 'bold',
      fontSize: 16,
      padding: 40
    }
  },
  series: [{
    data: probabilities.map((item: number) => item.toFixed(3)),
    type: 'bar',
    name: '概率密度',
    barWidth: '60%',
    itemStyle: {
      color: '#74B9FF'
    }
  }]
})


const IntervalsDensity: React.FC<{
  data: [],
}> = (props: {
  data: [],
}) => {

  const ref = useRef(null);

  useEffect(() => {
    // @ts-ignore
    ref?.current?.getEchartsInstance().setOption(renderOption(props.data['bin_centers'], props.data['counts']));
  }, [props.data]);

  return (
      <ReactEcharts
          notMerge={true}
          ref={ref}
          option={renderOption([], [])}
          style={{height: '500px', width: '100%'}}
      />
  );
}

export default IntervalsDensity;
