import axios from 'axios';

// 创建 Axios 实例并设置默认配置
const axiosInstance = axios.create({
    baseURL: '/api', // 设置基础 URL
    timeout: 10000, // 设置请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: any) => {
        // 在发送请求之前做些什么
        // 比如在这里可以加入 token
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error: any) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: any) => {
        // axios读取的headers的key都会转小写
        const authorizationHeader = response.headers['authorization'];
        if (authorizationHeader) {
            // 更新请求的 Header 中的 Authorization
            axiosInstance.defaults.headers.common['Authorization'] = authorizationHeader;
        }
        // 对响应数据做点什么
        return response;
    },
    (error: any) => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default axiosInstance;
