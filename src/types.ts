type IntervalAnalyse = {
  rrIntervals: {
    rrIntervals: number[],
    rrIntervalsAvarage: number[],
    rrIntervalsIntervals: number[],
  },
  intervalsDensityData: {
    binCenters: number[],
    counts: number[]
  },
  intervalScatterPlotData: {
    x_data: number[],
    y_data: number[],
    symmetry_point1: number[],
    symmetry_point2: number[],
    angle: number
  },
  intervalScatterDistributedPlotData: {
    x_data: number[],
    y_data: number[]
  },
  frequencies: number[],
  normalizedPsd: number[],
  psdHistogramData: number[]
}

export type { IntervalAnalyse }