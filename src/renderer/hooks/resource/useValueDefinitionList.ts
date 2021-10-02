import { VALUE_RESOURCE_TYPES } from "src/enum";
import { TypeResXmlDefinition } from "src/types/resource";
import { useResourceList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useValueDefinitionList(): TypeResXmlDefinition[] {
  const resourceList = useResourceList();
  return resourceList.filter(
    item => item.tag !== VALUE_RESOURCE_TYPES.IMAGE
  ) as TypeResXmlDefinition[];
}
