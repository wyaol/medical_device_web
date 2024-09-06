import ReactEcharts from "echarts-for-react";
import React from "react";

const PSDHistogram: React.FC<{ data: number[] }> = ({ data }) => {

  const renderOption = (data: number[]) => {
    return {
      title: {
        text: '心率变异 R-▲R 谱密度直方图',
      },
      xAxis: {
        type: 'category',
        data: ['VLF', 'LF', 'MF', 'HF', 'VHF'],
      },
      yAxis: {
        type: 'value',
        name: '谱密度（%）',
        // 显示轴标签
        axisLabel: {
          show: true,
        }

      },
      series: [
        {
          data: data,
          name: '谱密度（%）',
          type: 'bar'
        }
      ]
    }
  } 

  return (
    <ReactEcharts
      option={renderOption(data)}
      style={{ height: '500px', width: '100%' }}
    />
  );
};

export default PSDHistogram;