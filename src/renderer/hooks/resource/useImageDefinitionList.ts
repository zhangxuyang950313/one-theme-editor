import { RESOURCE_TYPES } from "src/enum";
import { TypeResourceImageDefinition } from "src/types/resource";
import { useResourceTypeList, useResourceDefinitionList } from ".";

/**
 * 图片类型素材定义列表
 */
export default function useImageDefinitionList(): TypeResourceImageDefinition[] {
  const resourceTypeList = useResourceTypeList();
  const resourceDefinitionList = useResourceDefinitionList();
  const imageResourceTags = resourceTypeList
    .filter(item => item.type === RESOURCE_TYPES.IMAGE)
    .map(item => item.tag);
  return resourceDefinitionList.flatMap(item =>
    imageResourceTags.includes(item.tagName) ? [item] : []
  ) as TypeResourceImageDefinition[];
}
