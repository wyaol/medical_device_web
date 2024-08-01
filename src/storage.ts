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
    deviceId: "190070690681122",
    plusWave: {
        connect: {
            success: false,
            message: ''
        },
        bluetooth: []
    }
}

export default storage
