import path from "path";
import { filenameIsXml } from "common/utils";
import PageConfig from "server/compiler/PageConfig";
import { findProjectByUUID } from "server/db-handler/project";
import { TypeProjectSourceData } from "src/types/project";
import { filenameIsImage } from "src/common/utils";
import { PROJECT_FILE_TYPE } from "src/enum";
import BaseCompiler from "server/compiler/BaseCompiler";

export async function getPageDefineSourceData(
  uuid: string,
  config: string
): Promise<Record<string, TypeProjectSourceData>> {
  const { projectPathname, sourceConfigPath } = await findProjectByUUID(uuid);
  const namespace = path.dirname(sourceConfigPath);
  const sourcePathList = new PageConfig({
    namespace,
    config
  }).getSourceDefinePathList();
  return sourcePathList.reduce<Record<string, TypeProjectSourceData>>(
    (record, src) => {
      const absPath = path.join(projectPathname, src);
      if (filenameIsImage(src)) {
        record[src] = {
          type: PROJECT_FILE_TYPE.IMAGE,
          path: src,
          sourceData: {
            src: `http://localhost:30000/image?file=${absPath}&count=${new Date().getTime()}`
          }
        };
      }
      if (filenameIsXml(src)) {
        record[src] = {
          type: PROJECT_FILE_TYPE.XML,
          path: src,
          valueData: new BaseCompiler(absPath).getElement()
        };
      }
      return record;
    },
    {}
  );
}
