import { FILE_PROTOCOL } from "src/enum";
import { TypeResXmlValDefinition } from "src/types/resource";
import { useResDefinitionList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useValueDefinitionList(): TypeResXmlValDefinition[] {
  const resourceList = useResDefinitionList();
  return resourceList.flatMap(item =>
    item.protocol === FILE_PROTOCOL.XML ? [item] : []
  );
}
