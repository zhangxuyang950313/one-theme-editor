import axios, { AxiosInstance } from "axios";
import { HOST, PORT } from "common/config";
import { TypeGetCanceler } from "types/request";

export const createHttp = (getCanceler?: TypeGetCanceler): AxiosInstance => {
  const http = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
    cancelToken: getCanceler && new axios.CancelToken(getCanceler),
    validateStatus: status => [200, 400].includes(status)
  });
  http.interceptors.response.use(data => {
    if (data.status === 200) return data;
    throw new Error(data.data.data);
  });
  return http;
};
