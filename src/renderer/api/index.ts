import axios from "axios";
import { TypeBrandInfo, TypeTemplateConf } from "types/project";
import { HOST, PORT } from "common/config";

const http = axios.create({
  baseURL: `http://${HOST}:${PORT}`
});

const API = {
  GET_TEMPLATE_LIST: "/template/list"
};

type TypeAxiosResponse<T> = {
  msg: "success" | "fail";
  data: T;
};

export async function getTemplateList(
  brandInfo: TypeBrandInfo
): Promise<TypeTemplateConf[]> {
  return http
    .get<TypeAxiosResponse<TypeTemplateConf[]>>(API.GET_TEMPLATE_LIST, {
      params: { brandType: brandInfo.type }
    })
    .then(data => data.data.data);
}
