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
    co2SerialData: {
        co2WaveformData: {
            co2Waveform: number[],
            co2WaveformTime: number[],
            data: {
                co2_waveform: number,
                interval: number,
                dpi_info: { status: string, I_per_E: number }
            }
        },
        co2RealDpiInfo: {
            etco2Waveform: number[],
            etco2WaveformTime: number[],
            lastETCO2: number,
            data: {
                ETCO2: number, RR: number, FiCO2: number
            }
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
    co2SerialData: {
        co2WaveformData: {
            co2Waveform: new Array(60),
            co2WaveformTime: new Array(60),
            data: {
                co2_waveform: 0,
                interval: 0,
                dpi_info: { status: '', I_per_E: 0 }
            }
        },
        co2RealDpiInfo: {
            etco2Waveform: new Array(60),
            etco2WaveformTime: new Array(60),
            lastETCO2: 0,
            data: {
                ETCO2: 0, RR: 0, FiCO2: 0
            }
        }
    }
}

export default storage
