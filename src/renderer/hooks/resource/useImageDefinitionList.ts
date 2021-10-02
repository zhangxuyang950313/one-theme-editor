import { RESOURCE_TYPES } from "src/enum";
import { TypeResImageDefinition } from "src/types/resource";
import { useResTypeList, useResDefinitionList } from ".";

/**
 * 图片类型素材定义列表
 */
export default function useImageDefinitionList(): TypeResImageDefinition[] {
  const resourceTypeList = useResTypeList();
  const resourceList = useResDefinitionList();
  const imageResourceTags = resourceTypeList
    .filter(item => item.type === RESOURCE_TYPES.IMAGE)
    .map(item => item.tag);
  return resourceList.flatMap(item =>
    imageResourceTags.includes(item.tag) ? [item] : []
  ) as TypeResImageDefinition[];
}
