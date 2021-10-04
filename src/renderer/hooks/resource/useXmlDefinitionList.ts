import { FILE_TYPE } from "src/enum";
import { TypeResXmlValDefinition } from "src/types/resource";
import { useResDefinitionList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useXmlDefinitionList(): TypeResXmlValDefinition[] {
  const resourceList = useResDefinitionList();
  return resourceList.flatMap(item =>
    item.sourceData.fileType === FILE_TYPE.XML ? item : []
  );
}
