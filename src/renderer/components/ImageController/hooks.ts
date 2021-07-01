import path from "path";
import { notification } from "antd";
import { apiCopyFile } from "@/api";
import { useProjectRoot } from "@/hooks/project";
import ERR_CODE from "@/core/error-code";

export function useCopyToWith(
  toLst: string[],
  sourceName: string
): (copyFrom: string) => void {
  const projectRoot = useProjectRoot();

  // 拷贝到模板素材
  return (file: string) => {
    if (!(Array.isArray(toLst) && toLst.length > 0)) {
      notification.warn({ message: `"${sourceName}"${ERR_CODE[3006]}` });
      return;
    }
    if (!projectRoot) {
      notification.warn({ message: ERR_CODE[2001] });
      return;
    }
    toLst.forEach(item => {
      const target = path.join(projectRoot, item);
      apiCopyFile(file, target);
    });
  };
}
