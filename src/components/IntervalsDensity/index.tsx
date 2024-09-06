import ReactEcharts from "echarts-for-react";
import React from "react";

const renderOption = (binCenters: number[], probabilities: number[]) => ({
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
      fontSize: 8,
      padding: 10
    }
  },
  yAxis: {
    max: 0.028,
    type: 'value',
    name: '概率密度',
    nameLocation: 'middle',
    nameTextStyle: {
      fontSize: 10,
      padding: 25
    }
  },
  series: [{
    data: probabilities.map((item: number) => item.toFixed(3)),
    type: 'bar',
    name: '概率密度',
    // barWidth: '60%',
    itemStyle: {
      color: '#74B9FF'
    }
  }]
})


const IntervalsDensity: React.FC<{
  binCenters: number[],
  counts: number[]
}> = (props: {
  binCenters: number[],
  counts: number[]
}) => {

  return (
      <ReactEcharts
          notMerge={true}
          option={renderOption(props.binCenters, props.counts)}
          style={{height: '300px', width: '500px'}}
      />
  );
}

export default IntervalsDensity;
