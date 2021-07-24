// import path from "path";
import fse from "fs-extra";
import FileType from "file-type";
import { Express } from "express";
import API from "common/apiConf";
// import PATHS from "server/utils/pathUtils";
import ERR_CODE from "src/common/errorCode";
import { UnionTupleToObjectKey } from "src/types/request";

export default function image(service: Express): void {
  /**
   * 图片服务
   * @params file 图片本地路径
   */
  service.get<
    never, // reqParams
    typeof API.IMAGE.body, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof API.IMAGE.query> // reqQuery
  >(API.IMAGE.url, async (req, res) => {
    async function getImgBuffAndFileType(file: string) {
      if (!fse.existsSync(file)) {
        throw new Error(ERR_CODE[4003]);
      }
      const buff = fse.readFileSync(file);
      const fileType = await FileType.fromBuffer(buff);
      if (!fileType) {
        throw new Error(ERR_CODE[4003]);
      }
      return { buff, fileType };
    }
    try {
      const { filepath } = req.query;
      const { buff, fileType } = await getImgBuffAndFileType(filepath);
      // .catch(
      //   async () => {
      //     const errImg = path.join(PATHS.ASSETS_DIR, "img-err.png");
      //     return getImgBuffAndFileType(errImg);
      //   }
      // );
      res.set({ "Content-Type": fileType.mime });
      res.send(buff);
    } catch (err) {
      console.warn("图片加载异常", err.message);
      res.status(400).send();
    }
  });
}