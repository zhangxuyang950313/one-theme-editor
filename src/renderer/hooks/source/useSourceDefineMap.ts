import { TypeSourceDefine } from "src/types/source";
import { useSourceDefineList } from ".";
/**
 * 所有类型素材定义 map tag -> list
 * @deprecated
 */
export default function useSourceDefineMap(): Map<string, TypeSourceDefine[]> {
  const sourceDefineList = useSourceDefineList();
  return sourceDefineList.reduce<Map<string, TypeSourceDefine[]>>((t, o) => {
    t.set(o.tagName, [...(t.get(o.tagName) || []), o]);
    return t;
  }, new Map());
}
