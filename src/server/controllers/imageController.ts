import { Express } from "express";
import apiConfig from "src/constant/apiConf";
import { UnionTupleToObjectKey } from "src/types/request";
import { checkParamsKey } from "server/utils/requestUtil";
import { getImgBuffAndFileType } from "src/common/utils";

export default function imageController(service: Express): void {
  /**
   * 图片服务
   * @params file 图片本地路径
   */
  service.get<
    never, // reqParams
    Buffer, // resBody
    never, // reqBody
    UnionTupleToObjectKey<typeof apiConfig.IMAGE.query> // reqQuery
  >(apiConfig.IMAGE.path, async (req, res) => {
    checkParamsKey(req.query, apiConfig.IMAGE.query);
    try {
      const { filepath } = req.query;
      const { buff, fileType } = await getImgBuffAndFileType(filepath).catch(
        () => {
          // const errImg = path.join(pathUtil.ASSETS_DIR, "img-err.png");
          // return getImgBuffAndFileType(errImg);
          return { buff: Buffer.from(""), fileType: { mime: "image/png" } };
        }
      );
      res.set({ "Content-Type": fileType.mime });
      res.send(buff);
    } catch (err) {
      res.status(400).send();
    }
  });
}
