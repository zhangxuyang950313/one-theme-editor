import { VALUE_RESOURCE_TYPES } from "src/enum";
import { TypeResImageDefinition } from "src/types/resource";
import { useResourceTypeList, useResourceList } from ".";

/**
 * 图片类型素材定义列表
 */
export default function useImageDefinitionList(): TypeResImageDefinition[] {
  const resourceTypeList = useResourceTypeList();
  const resourceList = useResourceList();
  const imageResourceTags = resourceTypeList
    .filter(item => item.type === VALUE_RESOURCE_TYPES.IMAGE)
    .map(item => item.tag);
  return resourceList.flatMap(item =>
    imageResourceTags.includes(item.tag) ? [item] : []
  ) as TypeResImageDefinition[];
}
