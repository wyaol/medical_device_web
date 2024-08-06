export interface Storage {
  deviceId: string
  plusWave: {
    connect: {
      success: boolean
      message: string
    },
    bluetooth: Record<string, string>[],
    data: Record<string, number[]>
  }
}

const len = 20

const storage: Storage = {
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
  }
}

export default storage
