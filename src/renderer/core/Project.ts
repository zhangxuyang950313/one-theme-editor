import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectInfo,
  TypeTemplateConf,
  TypeTempUiVersionConf
} from "@/types/project";
import { addProject } from "./data";
import TemplateCompiler from "./TemplateCompiler";
import { arrayToMapByKey } from "./utils";

export type TypeProjectProps = {
  brandInfo: TypeBrandInfo;
  uiVersion: TypeTempUiVersionConf;
  projectInfo: TypeProjectInfo;
  templateConf: TypeTemplateConf;
};

export default class Project extends TemplateCompiler {
  public isInitialized: boolean;
  // 厂商信息
  protected brandInfo: TypeBrandInfo;
  // ui 版本
  protected uiVersion: TypeTempUiVersionConf;
  // 主题描述信息
  private projectInfo: TypeProjectInfo;

  constructor(props: TypeProjectProps) {
    super(props);
    this.brandInfo = props.brandInfo;
    this.projectInfo = props.projectInfo;
    this.uiVersion = props.uiVersion;
    this.isInitialized = false;
  }

  // 从现有数据安装主题
  public setup(props: TypeProjectData): void {
    super.imageData = props.imageData;
    super.pageConfData = props.pageConfData;
    super.previewConf = props.previewConf;
    super.templateConf = props.templateConf;
    // 生成数据索引
    super.imageDataMap = arrayToMapByKey(props.imageData, "key");
    super.pageConfDataMap = arrayToMapByKey(props.pageConfData, "key");
    this.projectInfo = props.projectInfo;
    this.uiVersion = props.uiVersion;
    this.isInitialized = true;
  }

  // 从模板创建主题
  // 和现有数据不同的是，从模板创建主题是要解析模板数据配合版本进行初始化的，而数据是初始化后的储存
  public async create(): Promise<TypeProjectData> {
    // 生成预览数据
    const previewConf = await super.generateTempPreviewData();
    this.isInitialized = true;
    // 写入数据库
    return addProject({
      brandInfo: this.brandInfo,
      uiVersion: this.uiVersion,
      projectInfo: this.projectInfo,
      templateConf: this.templateConf,
      previewConf: previewConf,
      imageData: this.imageData,
      pageConfData: this.pageConfData
    });
  }

  // 更新项目信息
  public updateProjectInfo(projectInfo: TypeProjectInfo): void {
    this.projectInfo = {
      ...this.projectInfo,
      ...projectInfo
    };
  }
}
