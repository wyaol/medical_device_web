import { Select, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { getMetrics, getTrend } from "../../service/plusWaveService";
import ReactEcharts from "echarts-for-react";

interface Metric {
  name: string;
  key: string;
  value: number;
}

interface Column {
  title: string;
  dataIndex: string;
  key: string;
}

interface DataSource {
  key: string;
  [key: string]: number | string;
}

const getColumnsAndDataFromMetrics = (metrics: Metric[]) => {
  const columns: Column[] = metrics.map((metric) => ({
    title: metric.name,
    dataIndex: metric.key,
    key: metric.key,
  }));

  const dataSource: DataSource[] = [
    metrics.reduce((acc, metric) => {
      acc[metric.key] = Math.round(metric.value);
      return acc;
    }, { key: '1' } as DataSource),
  ];

  return { columns, dataSource };
}

const renderMetricsTable = (metrics: Metric[]) => {
  const { columns, dataSource } = getColumnsAndDataFromMetrics(metrics);
  return <Table dataSource={dataSource} columns={columns} />;
}

const renderOption = (data: {label: string, value: number[]}[]) => {
console.log(data)

  const dataArrays = data.map(item => ({
    name: item.label,
    data: item.value,
    type: 'line',
    smooth: true,
    showSymbol: false,
  }))

  return {
    xAxis: {
      show: false,
      type: 'category',
      // data: categories(len),
    },
    yAxis: {
      type: 'value'
    },
    legend: {
      data: data.map(item => item.label)
    },
    series: dataArrays,
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
    },
  }
}

const PlusWaveMetrics: React.FC<{
  periodId: number | null
}> = ({ periodId }) => {

  const [basicMetrics, setBasicMetrics] = useState([])
  const [timeDomainMetrics, setTimeDomainMetrics] = useState([])
  const [frequencyDomainMetrics, setFrequencyDomainMetrics] = useState([])
  const [timeInterval, setTimeInterval] = useState<number | null>(null)

  const chartRef = useRef(null);

  useEffect(() => {
    getMetrics(periodId).then(metrics => {
      setBasicMetrics(metrics['basic']);
      setTimeDomainMetrics(metrics['time_domain']);
      setFrequencyDomainMetrics(metrics['frequency_domain']);
    })
  }, [periodId])

  return (<div>
    <div>
      <h1>总体分析</h1>
      {basicMetrics.length > 0 && <div>
        <h1>基础指标</h1>
        {renderMetricsTable(basicMetrics)}
      </div>}
      {timeDomainMetrics.length > 0 && <div>
        <h1>时域指标</h1>
        {renderMetricsTable(timeDomainMetrics)}
      </div>}
      {frequencyDomainMetrics.length > 0 && <div>
        <h1>频域指标</h1>
        {renderMetricsTable(frequencyDomainMetrics)}
      </div>}
    </div>
    <div>
      <h1>趋势分析</h1>
      <Select
        placeholder="请选择"
        options={[
          {
            value: 1,
            label: '1分钟',
          },
          {
            value: 2,
            label: '2分钟',
          },
          {
            value: 3,
            label: '3分钟',
          },
          {
            value: 5,
            label: '5分钟',
          },
          {
            value: 10,
            label: '10分钟',
          },
        ]}
        onChange={(value) => {
          setTimeInterval(value);
          getTrend(periodId, value).then(res => {
            // @ts-ignore
          chartRef?.current?.getEchartsInstance().setOption(renderOption(res));
          })
        }}
      />
      <ReactEcharts
        notMerge={true}
        ref={chartRef}
        option={renderOption([])}
        style={{ height: '500px', width: '100%' }}
      />
    </div>
  </div>)
};

export default PlusWaveMetrics;
