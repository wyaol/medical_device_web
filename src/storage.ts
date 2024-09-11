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
  }
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
    }
}

const len = 20

const storage: Storage = {
    dataCollectionPeriod: {
        startTime: null,
        endTime: null,
    },
    deviceId: "190070690681122",
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
        }
    }
}

export default storage
