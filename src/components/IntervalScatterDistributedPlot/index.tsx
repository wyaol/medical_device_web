import React from "react";
import ReactEcharts from "echarts-for-react";

const renderOption = (lorenzHeartRateData: {
  x_data: number[],
  y_data: number[]
}) => {
  const x_data = lorenzHeartRateData.x_data
  const y_data = lorenzHeartRateData.y_data
  const centerX = x_data.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / x_data.length;
  const centerY = y_data.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / y_data.length;
  return {
    title: {
      text: '散点分布图',
      left: 'center'
    },
    xAxis: {
      name: 'RR_n',
    },
    yAxis: {
      name: 'RR_n+1',
    },
    series: [
      {
        data: x_data.map((_, index) => [x_data[index], y_data[index]]),
        type: 'scatter',
      },
      {
        data: [[0, centerY], [1200, centerY]],
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: 'green',
          zlevel: 1,
        }
      },
      {
        data: [[centerX, 0], [centerX, 1200]],
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: 'green',
          zlevel: 1,
        }
      },
      {
        // 中心点
        data: [[centerX, centerY]],
        type: 'scatter',
        itemStyle: {
          color: 'black',
        },
        symbolSize: 12,
      },
    ],
  }
}

const HeartbeatIntervalScatterDistributedPlot: React.FC<{
  data: { x_data: number[], y_data: number[]},
}> = (props: {
  data: { x_data: number[], y_data: number[]},
}) => {

  return <div>
    <ReactEcharts
      notMerge={true}
      option={renderOption(props.data)}
      style={{height: '500px', width: '500px'}}
    />
  </div>
}

export default HeartbeatIntervalScatterDistributedPlot