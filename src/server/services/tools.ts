import fse from "fs-extra";
import { Express } from "express";

import API from "common/api";
import PATHS from "server/utils/pathUtils";
import ERR_CODE from "renderer/core/error-code";
import { result } from "server/utils/utils";
import { TypeResult } from "types/request";
import { compactNinePatch } from "server/core/pack";

export default function tools(service: Express): void {
  // 获取路径配置
  service.get(API.GET_PATH_CONFIG, async (req, res) => {
    try {
      res.send(result.success(PATHS));
    } catch (err) {
      res.status(400).send(result.fail(err.message));
    }
  });

  // 复制本地文件
  service.post<
    never, // reqParams
    TypeResult<null>, // resBody
    { from: string; to: string } // reqBody
  >(API.COPY_FILE, (req, res) => {
    try {
      const { from, to } = req.body;
      if (!fse.existsSync(from)) {
        res.status(400).send(result.fail(ERR_CODE[4003]));
        return;
      }
      fse.copySync(from, to);
      // fse.createReadStream(from).pipe(fse.createWriteStream(to)).destroy();
      res.send(result.success(null));
    } catch (err) {
      console.log(err);
      res.status(400).send(result.fail(err.message));
    }
  });
  // 删除本地文件
  service.post<never, TypeResult<null>, { file: string }>(
    API.DELETE_FILE,
    (req, res) => {
      try {
        const { file } = req.body;
        if (!fse.existsSync(file)) {
          res.status(400).send(result.fail(ERR_CODE[4003]));
          return;
        }
        fse.unlinkSync(file);
        res.send(result.success(null));
      } catch (err) {
        res.status(400).send(result.fail(err.message));
      }
    }
  );

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

  service.get(API.PACK_PROJECT, async (request, response) => {
    const data = compactNinePatch();
    console.log(data);
    response.send(result.success(data));
  });
}
