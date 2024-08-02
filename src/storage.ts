export interface Storage {
    deviceId: string
    plusWave: {
        connect: {
            success: boolean
            message: string
        },
        bluetooth: Record<string, string>[]
    }
}

const storage: Storage = {
    deviceId: "59914161336601",
    plusWave: {
        connect: {
            success: false,
            message: ''
        },
        bluetooth: []
    }
}

export default storage
