import { RESOURCE_TYPES } from "src/enum";
import { TypeResourceValueDefined } from "src/types/resource";
import { useResourceTypeList, useResourceDefineList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useValueDefinedList(): TypeResourceValueDefined[] {
  const XML_VALUE_TYPE = new Set([
    RESOURCE_TYPES.COLOR,
    RESOURCE_TYPES.BOOLEAN,
    RESOURCE_TYPES.STRING,
    RESOURCE_TYPES.NUMBER
  ]);
  const resourceTypeList = useResourceTypeList();
  const resourceDefineList = useResourceDefineList();
  const valueSourceTags = resourceTypeList
    .filter(item => XML_VALUE_TYPE.has(item.type))
    .map(item => item.tag);
  return resourceDefineList.flatMap(item =>
    valueSourceTags.includes(item.tagName) ? [item] : []
  ) as TypeResourceValueDefined[];
}
