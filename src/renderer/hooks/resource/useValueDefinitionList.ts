import { RESOURCE_TYPES } from "src/enum";
import { TypeResXmlDefinition } from "src/types/resource";
import { useResDefinitionList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useValueDefinitionList(): TypeResXmlDefinition[] {
  const resourceList = useResDefinitionList();
  return resourceList.filter(
    item => item.tag !== RESOURCE_TYPES.IMAGE
  ) as TypeResXmlDefinition[];
}
