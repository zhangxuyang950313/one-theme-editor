import Template from "./Template";
import { arrayToMapByKey } from "./utils";
import {
  TypeBrandInfo,
  TypeProjectData,
  TypeProjectInfo,
  TypeTemplateConf,
  TypeUiVersionConf
} from "$/types/project";

export type TypeCreateProject = {
  brandInfo: TypeBrandInfo;
  uiVersion: TypeUiVersionConf;
  projectInfo: TypeProjectInfo;
  templateConf: TypeTemplateConf;
};

export default class Project extends Template {
  public isInitialized: boolean;
  // 厂商信息
  protected brandInfo: TypeBrandInfo;
  // ui 版本
  protected uiVersion: TypeUiVersionConf;
  // 主题描述信息
  private projectInfo: TypeProjectInfo;

  constructor(props: TypeCreateProject) {
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
  // public async create(): Promise<TypeProjectData> {
  //   // 写入数据库
  //   // const result = await addProject({
  //   //   brandInfo: this.brandInfo,
  //   //   uiVersion: this.uiVersion,
  //   //   projectInfo: this.projectInfo,
  //   //   templateConf: this.templateConf,
  //   //   previewConf: await super.generateTempPreviewData(), // 生成预览数据
  //   //   imageData: this.imageData,
  //   //   pageConfData: this.pageConfData
  //   // });
  //   this.isInitialized = true;
  //   // return result;
  // }
}
