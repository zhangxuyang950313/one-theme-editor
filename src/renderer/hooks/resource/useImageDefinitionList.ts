import { RESOURCE_PROTOCOL } from "src/enum";
import { TypeResImageDefinition } from "src/types/resource";
import { useResDefinitionList } from "./";

/**
 * 图片类型素材定义列表
 */
export default function useImageDefinitionList(): TypeResImageDefinition[] {
  const resourceList = useResDefinitionList();
  return resourceList.flatMap(item =>
    item.protocol === RESOURCE_PROTOCOL.IMAGE ? [item] : []
  );
}
