import request from './config/request'
import { jwtDecode } from 'jwt-decode'; 

export const getCurrentPatient = () => {
    const authorization = request.defaults.headers.common['Authorization']?.toString();
    if (authorization) {
        const token = authorization.split(' ')[1];
        const decoded = jwtDecode(token);
        const payload = decoded.sub ? decoded.sub as Object as Record<string, any> : null;
        return payload ? payload.patient : null;
    } else {
        return null;
    }
}

export const getCO2RecordMinioObjectName = (startTime: Date | null, endTime: Date | null) => {
    const startTimeStr = startTime?.toISOString().replace(/[-:]/g, '').slice(0, 14);
    const endTimeStr = endTime?.toISOString().replace(/[-:]/g, '').slice(0, 14);
    return `${getCurrentPatient().patient_id}/${startTimeStr}-${endTimeStr}.cdr`;
}