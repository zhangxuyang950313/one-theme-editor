import { SOURCE_TYPES } from "src/enum";
import { TypeSourceDefineImage } from "src/types/source";
import { useSourceTypeList, useSourceDefineList } from ".";

/**
 * 图片类型素材定义列表
 */
export default function useSourceDefineImageList(): TypeSourceDefineImage[] {
  const sourceTypeList = useSourceTypeList();
  const sourceDefineList = useSourceDefineList();
  const imageSourceTags = sourceTypeList
    .filter(item => item.type === SOURCE_TYPES.IMAGE)
    .map(item => item.tag);
  return sourceDefineList.flatMap(item =>
    imageSourceTags.includes(item.tagName) ? [item] : []
  ) as TypeSourceDefineImage[];
}
