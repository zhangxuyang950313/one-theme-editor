import { RESOURCE_TYPES } from "src/enum";
import { TypeResourceImageDefined } from "src/types/resource";
import { useResourceTypeList, useResourceDefineList } from ".";

/**
 * 图片类型素材定义列表
 */
export default function useImageDefinedList(): TypeResourceImageDefined[] {
  const resourceTypeList = useResourceTypeList();
  const resourceDefineList = useResourceDefineList();
  const imageResourceTags = resourceTypeList
    .filter(item => item.type === RESOURCE_TYPES.IMAGE)
    .map(item => item.tag);
  return resourceDefineList.flatMap(item =>
    imageResourceTags.includes(item.tagName) ? [item] : []
  ) as TypeResourceImageDefined[];
}
