import React from 'react';
import './index.css';
import RRIntervals from '../../components/RRIntervals';
import IntervalsDensity from '../../components/IntervalsDensity';
import IntervalScatterPlot from '../../components/HeartbeatIntervalScatterPlot';
import IntervalScatterDistributedPlot from '../../components/HeartbeatIntervalScatterDistributedPlot';
import PSDProfile from '../../components/PSDProfile';
import PSDHistogram from '../../components/PSDHistogram';
import { IntervalAnalyse } from '../../types';

const IntervalAnalyseComponent = (props: {
  intervalAnalyse: IntervalAnalyse;
}) => {

  const {rrIntervals, intervalsDensityData, intervalScatterPlotData, intervalScatterDistributedPlotData, normalizedPsd, frequencies, psdHistogramData} = props.intervalAnalyse;

  return (
    <div className="plus-wave-report-container">
      <div>
        <div className="report-box">
          <div className="report-title">变异率分析</div>
          <div className="report-results">
            {rrIntervals.rrIntervals.length > 0 ? (
              rrIntervals.rrIntervals.slice(0, 500).map((rrInterval, index) => (
                <div key={index} className="interval-item">
                  {Math.round(rrInterval)}
                </div>
              ))
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </div>
        <div className="report-box intervals-container">
          <div>
            <RRIntervals title='间期' data={rrIntervals.rrIntervals} max={1400} min={0}/>
          </div>
          <div>
            <RRIntervals title={'间期（平均值）'} data={rrIntervals.rrIntervalsAvarage} max={500} min={-500}/>
          </div>
          <div>
            <RRIntervals title={'间期（差值）'} data={rrIntervals.rrIntervalsIntervals} max={500} min={-500}/>
          </div>
        </div>

        <div className="report-box intervals-container-2">
          <div>
            <IntervalsDensity binCenters={intervalsDensityData.binCenters} counts={intervalsDensityData.counts}/>
          </div>
          <div>
            <IntervalScatterPlot data={intervalScatterPlotData}/>
          </div>
          <div>
            <IntervalScatterDistributedPlot data={intervalScatterDistributedPlotData}/>
          </div>
        </div>

        <div className="report-box psd-container">
          <div>
            <PSDProfile frequencies={frequencies} normalizedPsd={normalizedPsd}/>
          </div>
          <div>
            <PSDHistogram data={psdHistogramData}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntervalAnalyseComponent;
