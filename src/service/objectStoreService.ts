import axios from "axios";

export const putObjectByPresignedUrl = async (presignedUrl: string, objectName: string, blob: Blob) => {
    try {
        const headers = {
            'Content-Type': blob.type,
        };
        await axios.put(presignedUrl, blob, { headers });
    } catch (error) {
        console.error('上传视频时发生错误:', error);
    }
}

export const getObjectByPresignedUrl = async (presignedUrl: string) => {
    try {
        const response = await axios.get(presignedUrl, {responseType: 'blob'});
        return response.data;
    } catch (error) {
        console.error('获取对象时发生错误:', error);
        throw error;
    }
}