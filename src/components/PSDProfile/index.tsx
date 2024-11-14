import ReactEcharts from "echarts-for-react";
import React from "react";


const renderOption = (data: any) => ({
  title: {
    text: '变异谱密度分布图  '
  },
  xAxis: {
    type: 'value',
    name: '频率（Hz）',
  },
  yAxis: {
    type: 'value',
    name: '谱密度（%）'
  },
  series: [
    {
      name: '谱密度（%）',
      data: data,
      type: 'line',
      smooth: true,
      showSymbol: false
    },
    {
      name: 'VLF',
      data: [[0.0033, 0.00], [0.0033, 0.08]],
      type: 'line',
      color: 'green',
    },
    {
      name: 'LF',
      data: [[0.05, 0.00], [0.05, 0.08]],
      type: 'line',
      color: 'green'
    },
    {
      name: 'MF',
      data: [[0.15, 0.00], [0.15, 0.08]],
      type: 'line',
      color: 'green'
    },
    {
      name: 'HF',
      data: [[0.25, 0.00], [0.25, 0.08]],
      type: 'line',
      color: 'green'
    },
    {
      name: 'VHF',
      data: [[0.4, 0.00], [0.4, 0.08]],
      type: 'line',
      color: 'green'
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
  // toolbox: {
  //   show: true,
  //   feature: {
  //     dataView: { readOnly: false },
  //     restore: {},
  //     saveAsImage: {}
  //   }
  // }
})

// eslint-disable-next-line 
function zip<T>(array1: Number[], array2: Number[]): Number[][] {
  return array1.map((item, index) => [item, array2[index]]);
}

const PSDProfile: React.FC<{
  frequencies: Number[], normalizedPsd: Number[]
}> = ({ frequencies, normalizedPsd }) => {
  const dataArray = zip(frequencies, normalizedPsd);

  return (
    <ReactEcharts
      notMerge={true}
      option={renderOption(dataArray)}
    />
  );
}

export default PSDProfile;
