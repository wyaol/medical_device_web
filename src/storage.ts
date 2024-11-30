export interface Storage {
  dataCollectionPeriod: {
    startTime: Date | null,
    endTime: Date | null,
  }
  deviceId: string
  plusWave: {
    connect: {
      success: boolean
      message: string
    },
    bluetooth: Record<string, string>[],
    data: Record<string, number[]>
  },
  co2Serial: {
    connect: {
      port: string | null
      message: string
    },
    devices: Record<string, string>[],
  },
  co2WaveformData: {
    curves: {
      co2Waveform: number[],
      co2WaveformTime: string[],
      etco2Waveform: number[],
      etco2WaveformTime: string[],
    }
    indicators: {
      co2Waveform: number,
      interval: number,
      status: string,
      I_per_E: number,
      ETCO2: number,
      RR: number,
      FiCO2: number
    }
    recordDuration: {
      startTime: Date | null,
      endTime: Date | null,
      upload: boolean
    }
  },
  BrainWavesDevice: {
    connect: {
      address: string | null
      message: string
    },
    devices: Record<string, string>[],
  },
  brainWavesData: {
    recordDuration: {
      startTime: Date | null,
      endTime: Date | null,
      upload: boolean
    }
    eegLeftParamsData: Record<string, number[]>,
    eegRightParamsData: Record<string, number[]>,
    ppgParamsData: Record<string, number[]>,
    eventMarkData: Record<string, number>,
    eegLeftWavesData: number[],
    eegRightWavesData: number[],
    ppgWavesData: number[],
  },
}

const len = 20
const brainWavesLen = 256

const storage: Storage = {
  dataCollectionPeriod: {
    startTime: null,
    endTime: null,
  },
  deviceId: "5288373550535",
  plusWave: {
    connect: {
      success: false,
      message: ''
    },
    bluetooth: [],
    data: {
      'blood_pressure_diastolic': Array(len).fill(0),
      'blood_pressure_systolic': new Array(len).fill(0),
      'heart_rate': new Array(len).fill(0),
      'microcirculation': new Array(len).fill(0),
      'oxygen_saturation': new Array(len).fill(0),
    }
  },
  co2Serial: {
    connect: {
      port: null,
      message: ""
    },
    devices: [],
  },
  co2WaveformData: {
    curves: {
      co2Waveform: [],
      co2WaveformTime: [],
      etco2Waveform: [],
      etco2WaveformTime: []
    },
    indicators: {
      co2Waveform: 0,
      interval: 0,
      status: '',
      I_per_E: 0,
      ETCO2: 0,
      RR: 0,
      FiCO2: 0
    },
    recordDuration: {
      startTime: null,
      endTime: null,
      upload: false
    }
  },
  BrainWavesDevice: {
    connect: {
      address: null,
      message: ""
    },
    devices: [],
  },
  brainWavesData: {
    recordDuration: {
      startTime: null,
      endTime: null,
      upload: false
    },
    eegLeftParamsData: {
      'qCON': Array(20).fill(0),
      'qNOX': Array(20).fill(0),
      'BS': Array(20).fill(0),
      'EMG': Array(20).fill(0),
      'SQI': Array(20).fill(0),
      'FREQ': Array(20).fill(0),
      'PImp': Array(20).fill(0),
      'RImp': Array(20).fill(0),
      'NImp': Array(20).fill(0),
    },
    eegRightParamsData: {
      'qCON': Array(20).fill(0),
      'qNOX': Array(20).fill(0),
      'BS': Array(20).fill(0),
      'EMG': Array(20).fill(0),
      'SQI': Array(20).fill(0),
      'FREQ': Array(20).fill(0),
      'PImp': Array(20).fill(0),
      'RImp': Array(20).fill(0),
      'NImp': Array(20).fill(0),
    },
    ppgParamsData: {
      'SpO2': Array(20).fill(0),
      'PR': Array(20).fill(0),
      'PI': Array(20).fill(0),
      'RR': Array(20).fill(0),
    },
    eventMarkData: {
      'IC': 0,
      'DT': 0,
      'DV': 0,
    },
    eegLeftWavesData: Array(brainWavesLen).fill(0),
    eegRightWavesData: Array(brainWavesLen).fill(0),
    ppgWavesData: Array(brainWavesLen).fill(0),
  }
}

export default storage
