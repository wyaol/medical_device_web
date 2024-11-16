import React from "react";
import ReactEcharts from "echarts-for-react";

const renderOption = (lorenzHeartRateData: {
  x_data: number[],
  y_data: number[],
  symmetry_point1: number[],
  symmetry_point2: number[],
  angle: number,
  board: number
}) => {
  const x_data = lorenzHeartRateData.x_data
  const y_data = lorenzHeartRateData.y_data
  const centerX = x_data.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / x_data.length;
  const centerY = y_data.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / y_data.length;
  const angle = `${lorenzHeartRateData.angle.toFixed(2)}°`;
  const board = lorenzHeartRateData.board
  return {
    title: {
      text: '彗星散点图',
      left: 'center'
    },
    xAxis: {
      name: 'RR_n',
      max: board,
    },
    yAxis: {
      name: 'RR_n+1',
      max: board,
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: '90%', // 文本的左边缘位置
          top: '5%', // 文本的顶边缘位置
          style: {
            text: angle, // 文本内容
            fill: '#ff0000', // 文本颜色
            fontSize: 15, // 字体大小
            textAlign: 'left', // 文本对齐方式
            textBaseline: 'middle', // 垂直对齐方式
          },
        },
      ],
    },
    series: [
      {
        data: x_data.map((_, index) => [x_data[index], y_data[index]]),
        type: 'scatter',
      },
      {
        // 45°对称轴
        data: [[0, 0], [board, board]],
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: 'green',
          zlevel: 1,
          width: 5
        }
      },
      {
        // 对称轴
        data: [lorenzHeartRateData.symmetry_point1, lorenzHeartRateData.symmetry_point2],
        type: 'line',
        lineStyle: {
          type: 'dashed',
          color: 'red',
          zlevel: 2
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

const IntervalScatterPlot: React.FC<{
  data: { x_data: number[], y_data: number[], symmetry_point1: number[], symmetry_point2: number[], angle: number, board: number },
}> = (props: {
  data: { x_data: number[], y_data: number[], symmetry_point1: number[], symmetry_point2: number[], angle: number, board: number },
}) => {

  return <div>
    <ReactEcharts
      notMerge={true}
      option={renderOption(props.data)}
      style={{height: '500px', width: '500px'}}
    />
  </div>
}

export default IntervalScatterPlot