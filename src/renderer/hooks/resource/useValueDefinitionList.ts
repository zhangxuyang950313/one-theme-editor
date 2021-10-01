import { IMAGE_RESOURCE_TYPES } from "src/enum";
import { TypeValueDefinition } from "src/types/resource";
import { useResourceList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useValueDefinitionList(): TypeValueDefinition[] {
  const resourceList = useResourceList();
  return resourceList.filter(
    item => item.tagName !== IMAGE_RESOURCE_TYPES.IMAGE
  ) as TypeValueDefinition[];
}
