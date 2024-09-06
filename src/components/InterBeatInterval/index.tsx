import React from "react";
import ReactEcharts from "echarts-for-react";

const renderOption = (data: number[]) => {
  // const minX = Math.min(...data.x_data);
  // const maxX = Math.max(...data.x_data);
  // const minY = Math.min(...data.y_data);
  // const maxY = Math.max(...data.y_data);

  // const min = Math.min(minX, minY);
  // const max = Math.max(maxX, maxY);

  // const centerX = (minX + maxX) / 2;
  // const centerY = (minY + maxY) / 2;

  return {
    title: {
      text: '心跳间期彗星图',
      left: 'center'
    },
    xAxis: {
      name: 'RR_n (seconds)',
      max: 1400
    },
    yAxis: {
      name: 'RR_n+1 (seconds)',
      max: 1400
    },
    series: [
      {
        data: data.map((_, index) => [data[index], data[index+1]]),
        type: 'scatter',
        symbolSize: 4,
      },
      // {
      //   // 对称轴
      //   data: [[0, 0], [max, max]],
      //   type: 'line',
      //   lineStyle: {
      //     type: 'dashed',
      //     color: 'red'
      //   }
      // },
      // {
      //   // 中心点
      //   data: [[centerX, centerY]],
      //   type: 'scatter',
      //   itemStyle: {
      //     color: 'black',
      //   },
      //   symbolSize: 12,
      // },
    ]
  }
}

const InterBeatInterval: React.FC<{
  data: number[],
}> = (props: {
  data: number[],
}) => {

  return <div>
    <ReactEcharts
      notMerge={true}
      option={renderOption(props.data)}
      style={{ height: '300px', width: '300px' }}
    />
  </div>
}

export default InterBeatInterval 