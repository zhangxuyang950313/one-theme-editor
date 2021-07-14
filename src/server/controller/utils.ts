import fse from "fs-extra";
import { Express } from "express";

import API from "common/apiConf";
import PATHS from "server/utils/pathUtils";
import ERR_CODE from "common/errorCode";
import { checkParamsKey, result } from "server/utils/utils";
import { TypeResponseFrame, UnionTupleToObjectKey } from "types/request";
import { compactNinePatch } from "server/core/pack";

export default function utils(service: Express): void {
  /**
   * 初始化接口，用于前后端数据交换
   * 客户端传来高频参数数据写入 cookies，下次客户端自动带上后端自由选取
   */
  service.post<
    never,
    TypeResponseFrame<typeof API.INIT.body, string>,
    typeof API.INIT.body
  >(API.INIT.url, async (request, response) => {
    for (const key in request.body) {
      response.cookie(key, request.body[key]);
    }
    response.cookie("sourcePathname", PATHS.SOURCE_CONFIG_DIR);
    response.send(result.success(request.body));
  });

  // 获取路径配置
  service.get<never, TypeResponseFrame<typeof PATHS>, typeof PATHS>(
    API.GET_PATH_CONFIG.url,
    async (request, response) => {
      response.send(result.success(PATHS));
    }
  );

  // 复制本地文件
  service.post<
    never, // reqParams
    TypeResponseFrame<null, string>, // resBody
    UnionTupleToObjectKey<typeof API.COPY_FILE.bodyKeys> // reqBody
  >(API.COPY_FILE.url, (request, response) => {
    checkParamsKey(request.body, API.COPY_FILE.bodyKeys);
    const { from, to } = request.body;
    if (!fse.existsSync(from)) {
      response.status(400).send(result.fail(ERR_CODE[4003]));
      return;
    }
    fse.copySync(from, to);
    // fse.createReadStream(from).pipe(fse.createWriteStream(to)).destroy();
    response.send(result.success(null));
  });
  // 删除本地文件
  service.post<
    never,
    TypeResponseFrame<null, string>,
    UnionTupleToObjectKey<typeof API.DELETE_FILE.bodyKeys>
  >(API.DELETE_FILE.url, (request, response) => {
    checkParamsKey(request.body, API.DELETE_FILE.bodyKeys);
    const { file } = request.body;
    if (!fse.existsSync(file)) {
      response.status(400).send(result.fail(ERR_CODE[4003]));
      return;
    }
    fse.unlinkSync(file);
    response.send(result.success(null));
  });

  // // 写入本地文件
  // service.post<any, any, { fileData: TypeFileData; to: string }>(
  //   API.WRITE_FILE,
  //   async (req, res) => {
  //     try {
  //       const { fileData, to } = req.body;
  //       const { url, base64 } = fileData;
  //       let md5 = fileData.md5;
  //       // base64 直接写入
  //       if (base64) {
  //         await base64ToLocalFile(to, base64).then(rw => rw && rw());
  //       }

  //       // md5 去查数据库获得 base64 再写入
  //       if (!md5 && url) md5 = path.basename(url);
  //       if (!md5) throw new Error("md5 为空");

  //       const imageData = await findImageData(md5);
  //       if (imageData.base64) {
  //         await base64ToLocalFile(to, imageData.base64).then(rw => rw && rw());
  //         return res.send(result.success());
  //       } else throw new Error(`图片数据库获取${md5}失败`);
  //     } catch (err) {
  //       // console.error(err);
  //       res.status(400).send(result.fail(`${ERR_CODE[4002]}, ${err}`));
  //     }
  //   }
  // );

  /**
   * 打包工程
   */
  service.get(API.PACK_PROJECT.url, async (request, response) => {
    const data = compactNinePatch();
    response.send(result.success(data));
  });
}
