import React from 'react';
import './index.css';
import RRIntervals from '../../components/RRIntervals';
import IntervalsDensity from '../../components/IntervalsDensity';
import IntervalScatterPlot from '../IntervalScatterPlot';
import IntervalScatterDistributedPlot from '../IntervalScatterDistributedPlot';
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
          <div className="report-title">间期</div>
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
            <RRIntervals title='间期' data={rrIntervals.rrIntervals} max={Math.max(...rrIntervals.rrIntervals)} min={0}/>
          </div>
          <div>
            <RRIntervals title={'间期（平均值）'} data={rrIntervals.rrIntervalsAvarage} max={Math.max(...rrIntervals.rrIntervalsAvarage)} min={-Math.max(...rrIntervals.rrIntervalsAvarage)}/>
          </div>
          <div>
            <RRIntervals title={'间期（差值）'} data={rrIntervals.rrIntervalsIntervals} max={Math.max(...rrIntervals.rrIntervalsIntervals)} min={-Math.max(...rrIntervals.rrIntervalsIntervals)}/>
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
