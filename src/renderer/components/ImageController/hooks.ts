import path from "path";
import { notification } from "antd";
import { apiCopyFile } from "@/api";
import { useProjectPathname } from "@/hooks/project";
import ERR_CODE from "@/core/error-code";

export function useCopyReleaseWith(
  releaseList: string[],
  sourceName: string
): (copyFrom: string) => void {
  const projectPathname = useProjectPathname();

  // 拷贝到模板素材
  return (file: string) => {
    if (!(Array.isArray(releaseList) && releaseList.length > 0)) {
      notification.warn({ message: `"${sourceName}"${ERR_CODE[3006]}` });
      return;
    }
    if (!projectPathname) {
      notification.warn({ message: ERR_CODE[2001] });
      return;
    }
    releaseList.forEach(item => {
      const target = path.join(projectPathname, item);
      apiCopyFile(file, target);
    });
  };
}
