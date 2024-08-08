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