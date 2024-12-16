import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost',
    // baseURL: 'http://localhost',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json", // 공통 요청 헤더타입 설정
    }
});
apiClient.interceptors.request.use((config) => {
    console.log("Request: ", config);
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        console.log("response= ");
        console.log(response.data);
        return response;
    },
    (error) => {
        console.error("Response Error: ", error);
        return Promise.reject(error);
    }
);
export default apiClient;