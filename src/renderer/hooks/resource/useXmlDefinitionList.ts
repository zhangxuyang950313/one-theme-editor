import { RESOURCE_PROTOCOL } from "src/enum";
import { TypeXmlValDefinition } from "src/types/resource";
import { useResDefinitionList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useXmlDefinitionList(): TypeXmlValDefinition[] {
  const resourceList = useResDefinitionList();
  return resourceList.flatMap(item =>
    item.protocol === RESOURCE_PROTOCOL.XML ? [item] : []
  );
}
