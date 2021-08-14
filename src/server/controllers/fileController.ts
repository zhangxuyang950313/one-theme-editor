import fse from "fs-extra";
import { Express } from "express";

import API from "common/apiConf";
import ERR_CODE from "common/errorCode";
import { checkParamsKey, result } from "server/utils/requestUtil";
import { TypeResponseFrame, UnionTupleToObjectKey } from "types/request";

export default function fileController(service: Express): void {
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
}
