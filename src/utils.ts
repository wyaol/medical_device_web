import request from './config/request'
import { jwtDecode } from 'jwt-decode'; 
import * as rrweb from 'rrweb';
import Gzip from 'gzip-js';

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

export const getRecordMinioObjectName = (startTime: Date | null, endTime: Date | null) => {
    const startTimeStr = startTime?.toISOString().replace(/[-:]/g, '').slice(0, 14);
    const endTimeStr = endTime?.toISOString().replace(/[-:]/g, '').slice(0, 14);
    return `${getCurrentPatient().patient_id}/${startTimeStr}-${endTimeStr}.cdr`;
}
export const decompressorEvents = async (blob: Blob) => {
    try {
        const arrayBuffer = new Uint8Array(await blob.arrayBuffer());
        const decompressedData = Gzip.unzip(arrayBuffer);
        const decompressedString = new TextDecoder().decode(new Uint8Array(decompressedData));
        return JSON.parse(decompressedString);
    } catch (error) {
        console.error('Error decompressing events:', error);
        return null;
    }
}
export const compressEvents = (events: any[]): Blob | null => {
    try {
        const eventsJson = JSON.stringify(events);
        const encodedData = new TextEncoder().encode(eventsJson);
        const compressedData = new Uint8Array(Gzip.zip(encodedData));
        return new Blob([compressedData], {type: 'application/octet-stream'});
    } catch (error) {
        console.error('Error compressing events:', error);
        return null;
    }
}
export  const startRecord = (events: any[]) => {
    return rrweb.record({
        emit: (event) => {
            events.push(event)
        },
        // 对 canvas 进行录制
        recordCanvas: true,
        // 配置抽样策略
        sampling: {
            // 不录制鼠标移动事件
            mousemove: false,
            // 定义不录制的鼠标交互事件类型，可以细粒度的开启或关闭对应交互录制
            mouseInteraction: {
                MouseUp: false,
                MouseDown: false,
                Click: false,
                ContextMenu: false,
                DblClick: false,
                Focus: false,
                Blur: false,
                TouchStart: false,
                TouchEnd: false,
            },
            // 设置滚动事件的触发频率
            scroll: 150, // 每 150ms 最多触发一次
            media: 800,
            // 设置输入事件的录制时机
            input: 'last' // 连续输入时，只录制最终值
        },
        slimDOMOptions: {
            script: false,
            comment: false,
            headFavicon: false,
            headWhitespace: false,
            headMetaDescKeywords: false,
            headMetaSocial: false,
            headMetaRobots: false,
            headMetaHttpEquiv: false,
            headMetaAuthorship: false,
            headMetaVerification: false,
        }
    });
}


export const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export const categories = (len: number): string[] => {
  let res: string[] = [];
  while (len--) {
    res.push(generateRandomString(10));
  }
  return res;
}