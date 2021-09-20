import { SOURCE_TYPES } from "src/enum";
import { TypeSourceDefineValue } from "src/types/source";
import { useSourceTypeList, useSourceDefineList } from ".";

/**
 * 值类型素材定义列表
 */
export default function useSourceDefineValueList(): TypeSourceDefineValue[] {
  const XML_VALUE_TYPE = new Set([
    SOURCE_TYPES.COLOR,
    SOURCE_TYPES.BOOLEAN,
    SOURCE_TYPES.STRING,
    SOURCE_TYPES.NUMBER
  ]);
  const sourceTypeList = useSourceTypeList();
  const sourceDefineList = useSourceDefineList();
  const valueSourceTags = sourceTypeList
    .filter(item => XML_VALUE_TYPE.has(item.type))
    .map(item => item.tag);
  return sourceDefineList.flatMap(item =>
    valueSourceTags.includes(item.tagName) ? [item] : []
  ) as TypeSourceDefineValue[];
}
