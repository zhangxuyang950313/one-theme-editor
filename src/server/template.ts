import { TypePreviewConf } from "types/project";
import {
  compileBrandConf,
  compileTempConf,
  getTempDescFileList
} from "common/Template";
import { HOST, PORT } from "common/config";
import { localImageToBase64Async } from "common/utils";
import { insertImageData } from "./image";

// 获取对应厂商模板
export async function getTemplates(
  brandType: string
): Promise<TypePreviewConf[]> {
  const brandInfoList = await compileBrandConf();
  const brandInfo = brandInfoList.find(item => item.type === brandType);
  if (!brandInfo) return [];
  const queue = getTempDescFileList(brandInfo).map(async file => {
    return compileTempConf(file).then(async conf => {
      const base64 = await localImageToBase64Async(conf.cover);
      const { _id } = await insertImageData({ md5: "", base64 });
      conf.cover = `http://${HOST}:${PORT}/image/?id=${_id}`;
      return conf;
    });
  });
  return await Promise.all(queue);
}
