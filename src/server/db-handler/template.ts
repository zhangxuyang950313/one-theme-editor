import path from "path";
import fse from "fs-extra";
import * as uuid from "uuid";
import SourceConfig from "src/data/SourceConfig";
import Template from "server/compiler/Template";
import { TEMPLATE_CONFIG, FRAMEWORK_DIR } from "common/paths";
import { TypeBrandConf, TypeCreateProjectData } from "types/project";
import { TypeSourceConfig, TypeTemplateData } from "types/template";

import ERR_CODE from "renderer/core/error-code";

// 解析厂商配置
export async function compileBrandConf(): Promise<TypeBrandConf[]> {
  if (!fse.existsSync(TEMPLATE_CONFIG)) {
    throw new Error(ERR_CODE[4003]);
  }
  const config: TypeBrandConf[] = JSON.parse(
    fse.readFileSync(TEMPLATE_CONFIG, "utf-8")
  );
  return config;
}

/**
 * 解析配置部分用于预览的信息
 * 只解析 description.xml 不需要全部解析
 * @param descFile description.xml 路径
 * @returns
 */
async function compileSourceConfig(
  descFile: string
): Promise<TypeSourceConfig> {
  const template = new Template(descFile);
  const sourceConfig = new SourceConfig();
  sourceConfig.setKey(uuid.v4());
  sourceConfig.setFile(descFile);
  sourceConfig.setRoot(path.dirname(descFile));
  sourceConfig.setName(await template.getName());
  sourceConfig.setPreview(await template.getPreview());
  sourceConfig.setVersion(await template.getVersion());
  sourceConfig.setUiVersion(await template.getUiVersion());
  return sourceConfig.getData();
}

export async function compileTempInfo(
  projectData: TypeCreateProjectData
): Promise<TypeTemplateData> {
  const template = new Template(
    projectData.configPreview.file,
    projectData.uiVersion
  );
  return template.getTempInfo();
}

// 获取对应厂商模板
export async function getConfigPreview(
  brandType: string
): Promise<TypeSourceConfig[]> {
  const brandConfList = await compileBrandConf();
  const brandConf = brandConfList.find(item => item.type === brandType);
  if (!brandConf) return [];
  const queue = brandConf.sourceConfigs
    .map(item => path.join(FRAMEWORK_DIR, item, "description.xml"))
    .filter(item => fse.existsSync(item))
    .map(compileSourceConfig);
  return await Promise.all(queue);
}
