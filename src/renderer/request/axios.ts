import axios, { AxiosInstance, AxiosResponse } from "axios";
import electronStore from "src/common/electronStore";
import { TypeGetCanceler, TypeResponseFrame } from "src/types/request";

export const createHttp = (getCanceler?: TypeGetCanceler): AxiosInstance => {
  const http = axios.create({
    baseURL: `http://${electronStore.get("hostname")}`,
    cancelToken: getCanceler && new axios.CancelToken(getCanceler),
    validateStatus: status => [200, 400].includes(status)
  });
  http.interceptors.request.use(config => {
    return config;
  });
  http.interceptors.response.use(
    (data: AxiosResponse<TypeResponseFrame<any>>) => {
      if (data.status === 200) return data.data;
      throw new Error(data.data.data);
    }
  );
  return http;
};
